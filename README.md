# Norgates — static site

Plain HTML, CSS and JavaScript. No build step, no dependencies: open
`index.html` in a browser, or drop the whole folder on GitHub Pages.

## Files

| File | What it's for |
| --- | --- |
| `index.html` | The page. Each section is marked with a comment, so copy can be edited in place. Head section holds the SEO tags. |
| `content.js` | Artists, platform logos, "Why Norgates" points, dashboard/video images, footer links, socials, and the Apply / Login links. |
| `style.css` | Colours and logo sizes at the top under **EASY SETTINGS**, then layout section by section. |
| `script.js` | Builds the lists from `content.js`, the endless platform strip, the arrow-driven artist row and the side scroller. |
| `images/` | Your logo and favicon, plus empty `artists/` and `platforms/` folders waiting for files. |
| `robots.txt` | Tells search engines the site is open to crawl. |

## Adding images

1. Put the file in `images/` (e.g. `images/artists/lungskull.jpg`).
2. Write its path in `content.js`, e.g. `{ name: "lungskull", image: "images/artists/lungskull.jpg" }`.

An empty path (`""`) or a missing file shows a dashed placeholder box instead,
so nothing breaks while the real files are still missing.

- **Artists** — square covers look best (`aspect-ratio: 1`).
- **Platforms** — white logos on transparent, about 72px tall.
- **Dashboard / feature pictures** — any size or shape; they fit without cropping.
- **Video** — `videoImage` is the poster frame, `videoLink` is where the play button goes.

## Publish on GitHub Pages

1. Push this folder to a repository.
2. Repo → Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Notes

- The Apply buttons open the link in `SITE.applyLink`.
- The canonical tag in `index.html` is commented out — uncomment it and set your
  real domain once the site is online.
