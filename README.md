# WorldFish Digital

Main site for [WorldFish](https://www.worldfishcenter.org/) digital tools and platforms—including **Peskas™** and related products—news, and resources.

## Run locally

You need **Node.js 20+** (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # optional; set your public site URL for previews
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Blog posts

Add Markdown files under `posts/`. Use frontmatter for title, date, `draft` (hide when `true`), and optionally `channel` (`worldfish` or `peskas`). Images and assets live under `public/`.

## Production build

```bash
npm run build
npm start
```

Deploy however you host Node apps; many teams use **Vercel**. Set **`NEXT_PUBLIC_SITE_URL`** to your live site URL so links and social previews resolve correctly.

## License

See `LICENSE`.
