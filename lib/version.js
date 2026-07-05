/**
 * App version — single source of truth is `version` in package.json.
 *
 * The value is injected into the build by next.config.js
 * (`env.NEXT_PUBLIC_APP_VERSION = require('./package.json').version`), so it is
 * available on both the server and the client without importing package.json
 * into the bundle.
 *
 * Semantic versioning (https://semver.org): MAJOR.MINOR.PATCH.
 * Bump with `npm run version:patch | version:minor | version:major`, add a
 * matching entry to NEWS.md, and the release workflow tags + publishes on merge
 * to main. See NEWS.md for the full flow.
 *
 * Nothing renders this yet (infrastructure only). To surface the version in the
 * UI later, import { APP_VERSION } from '@/lib/version'.
 */

/** Semantic version string, e.g. "7.0.0". */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

/** Git tag form of the version, e.g. "v7.0.0". Matches the release workflow. */
export const APP_VERSION_TAG = `v${APP_VERSION}`;
