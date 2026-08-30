# FormatLens

FormatLens turns JSON and technical text from a webpage into a readable browser side-panel view. Formatting happens locally, and the source page remains visible.

![FormatLens formatting a request payload](store-assets/large-promotional-tile-1400x560.png)

## Features

- Reads selected text, a focused field, or an element chosen with **Pick element**.
- Detects JSON, escaped JSON, and JSON stored inside strings.
- Provides syntax-highlighted **Pretty**, **Tree**, and **Raw** views.
- Searches text, keys, values, and JSON paths.
- Copies a complete document, one value, or an exact JSON path.
- Supports word wrap and system, light, and dark themes.
- Processes content locally without accounts, analytics, advertising, or a backend.

## Install locally

1. Clone or download this repository.
2. Open `edge://extensions` or `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the [`extension`](extension) folder.

## Use FormatLens

1. Select technical text or focus the field containing it.
2. Open FormatLens from the browser toolbar.
3. Select **Extract page text**. If needed, use **Pick element** and choose the field directly.
4. Inspect the result in **Pretty**, **Tree**, or **Raw** view.

## Permissions

| Permission | Purpose |
|---|---|
| `sidePanel` | Displays FormatLens beside the active webpage. |
| `scripting` | Runs the packaged extraction helper after the user requests it. |
| `storage` | Saves only the selected theme. |
| HTTP/HTTPS website access | Reads user-chosen content on ordinary webpages. |

FormatLens does not monitor pages in the background or transmit extracted content.

## Browser limitations

Browser-protected pages and some cross-origin or isolated iframe content cannot be inspected. If a field is inaccessible, select or copy its visible value directly.

## Repository structure

```text
FormatLens-Extension/
├── extension/       Browser extension package
├── docs/            GitHub Pages website and privacy page
├── store-assets/    Store logo, promotional tiles, and screenshots
├── PRIVACY.md       Privacy policy source
└── STORE_LISTING.md Edge Add-ons listing and submission notes
```

## Publishing

- [Website](https://sayanpramanik2012.github.io/FormatLens-Extension/)
- [Privacy policy](https://sayanpramanik2012.github.io/FormatLens-Extension/privacy-policy.html)
- [Store listing copy and checklist](STORE_LISTING.md)
- [Store artwork](store-assets)

To create the Edge Add-ons package, ZIP the contents of [`extension`](extension)—not the folder itself. `manifest.json` must be at the ZIP root.

## Privacy

Extracted content is processed only in the side panel and is discarded when that extension context closes or reloads. The only persistent setting is the selected theme.

[Read the privacy policy](PRIVACY.md)

## License

[MIT](LICENSE)
