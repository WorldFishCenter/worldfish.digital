import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import sync from '../scripts/sync-airtable.js';

/** The attachment pipeline, end to end on real bytes: Airtable hands the sync a URL, and
 *  what lands in public/ must be small, deterministic in name and safe to serve. `data:`
 *  URLs stand in for Airtable's, so nothing here touches the network. */

const { localise } = sync;
const dataUrl = (bytes, type) => `data:${type};base64,${bytes.toString('base64')}`;
const out = mkdtempSync(join(tmpdir(), 'wfd-sync-'));
test.after(() => rmSync(out, { recursive: true, force: true }));

const picture = (width, height, alpha) =>
    sharp({ create: { width, height, channels: alpha ? 4 : 3, background: { r: 30, g: 90, b: 120, alpha: 0.5 } } });

test('a photo is downscaled to a web size and written under a deterministic name', async () => {
    const photo = await picture(4000, 3000).png().toBuffer();
    const warnings = [];
    const file = await localise(
        { url: dataUrl(photo, 'image/png'), filename: 'IMG_0042.PNG' },
        'image', out, 'tools', 'peskas-api-hero', warnings
    );
    assert.deepEqual(file, { src: '/assets/portfolio/tools/peskas-api-hero.jpg', width: 2400, height: 1800 });
    const meta = await sharp(join(out, 'tools', 'peskas-api-hero.jpg')).metadata();
    assert.equal(meta.format, 'jpeg');
    assert.equal(meta.width, 2400);
    assert.deepEqual(warnings, []);
});

test('a small image is never enlarged', async () => {
    const small = await picture(800, 600).jpeg().toBuffer();
    const file = await localise({ url: dataUrl(small, 'image/jpeg'), filename: 's.jpg' }, 'image', out, 'tools', 'small-shot-1', []);
    assert.equal(file.width, 800);
});

test('a logo keeps its transparency; an SVG is rasterised, never served as SVG', async () => {
    const logo = await picture(1600, 400, true).png().toBuffer();
    const png = await localise({ url: dataUrl(logo, 'image/png'), filename: 'logo.png' }, 'logo', out, 'tools', 'x-logo', []);
    assert.equal(png.src, '/assets/portfolio/tools/x-logo.png');
    assert.equal(png.width, 800);
    assert.equal((await sharp(join(out, 'tools', 'x-logo.png')).metadata()).hasAlpha, true);

    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><script>alert(1)</script><rect width="200" height="100" fill="teal"/></svg>');
    const raster = await localise({ url: dataUrl(svg, 'image/svg+xml'), filename: 'mark.svg' }, 'logo', out, 'tools', 'y-logo', []);
    assert.equal(raster.src, '/assets/portfolio/tools/y-logo.png');
    assert.ok(!readFileSync(join(out, 'tools', 'y-logo.png')).includes('<script'));
});

test('a file that is not an image is skipped and reported, not published', async () => {
    const warnings = [];
    const file = await localise(
        { url: dataUrl(Buffer.from('not an image'), 'text/plain'), filename: 'notes.txt' },
        'image', out, 'tools', 'bad-hero', warnings
    );
    assert.equal(file, null);
    assert.equal(warnings.length, 1);
    assert.ok(!existsSync(join(out, 'tools', 'bad-hero.jpg')));
});

test('supporting documents are copied only when they are a document type', async () => {
    const pdf = await localise({ url: dataUrl(Buffer.from('%PDF-1.4'), 'application/pdf'), filename: 'Study.PDF' }, 'document', out, 'outcomes', 'rec1-document', []);
    assert.equal(pdf.src, '/assets/portfolio/outcomes/rec1-document.pdf');
    const warnings = [];
    const exe = await localise({ url: dataUrl(Buffer.from('MZ'), 'application/octet-stream'), filename: 'run.exe' }, 'document', out, 'outcomes', 'rec2-document', warnings);
    assert.equal(exe, null);
    assert.equal(warnings.length, 1);
});

const hasFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
test('a screen recording is compressed to a silent, web-playable mp4', { skip: !hasFfmpeg && 'ffmpeg not installed' }, async () => {
    const source = join(out, 'source.mov');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc=duration=1:size=1920x1080:rate=10', '-f', 'lavfi', '-i', 'sine=duration=1', '-shortest', source]);
    const warnings = [];
    const file = await localise({ url: dataUrl(readFileSync(source), 'video/quicktime'), filename: 'demo.mov' }, 'video', out, 'tools', 'x-demo', warnings);
    assert.deepEqual(file, { src: '/assets/portfolio/tools/x-demo.mp4' });
    assert.deepEqual(warnings, []);
    const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,height', '-of', 'csv=p=0', join(out, 'tools', 'x-demo.mp4')]).toString();
    assert.match(probe, /video,720/);
    assert.doesNotMatch(probe, /audio/);
    assert.ok(statSync(join(out, 'tools', 'x-demo.mp4')).size > 0);
    assert.ok(!existsSync(join(out, 'tools', 'x-demo.source')), 'the raw upload is not left behind');
});
