# FormatLens

FormatLens turns dense JSON and technical text on any webpage into a readable side-panel view without sending the content anywhere.

![FormatLens promotional banner](store-assets/large-promotional-tile-1400x560.png)

## What it does

- Opens beside the current webpage in the Microsoft Edge or Google Chrome side panel.
- Reads selected text first, then a focused input, textarea, editable field, `pre`, or `code` element.
- Includes Pick Element mode for choosing a specific visible field.
- Detects JSON, escaped JSON, and JSON nested inside JSON strings.
- Provides syntax-highlighted Pretty, Raw, and collapsible Tree views.
- Searches text, values, keys, and JSON paths.
- Copies the full formatted document, individual values, or exact JSON paths.
- Supports word wrap and system/light/dark themes.
- Performs all processing locally with no backend, analytics, or network transmission.

## Install locally

1. Download and extract the release ZIP, or clone this repository.
2. Open `edge://extensions` in Edge or `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the repository's **`extension`** folder—the folder that directly contains `manifest.json`.
6. Open a normal HTTP/HTTPS webpage and click the FormatLens toolbar icon.

## Use FormatLens

1. Select the payload or technical text on the webpage.
2. Open FormatLens and choose **Extract page text**.
3. If selection is impractical, choose **Pick element**, then click the field.
4. Switch among **Pretty**, **Tree**, and **Raw** views.
5. In Tree view, use the **Value** and **Path** buttons for precise copying.

## ServiceNow notes

FormatLens is optimized for values such as Request Payload fields. Selecting the field content first is the most reliable workflow.

- Open shadow-root fields are inspected where practical.
- Cross-origin iframes and protected browser pages cannot be read by extensions.
- Some ServiceNow Workspace components render inside isolated frames or expose only truncated text. In those cases, select/copy the field value directly or use a classic form view.
- FormatLens reads what the browser exposes in the page; it does not query ServiceNow APIs or retrieve hidden server-side data.

## Permissions

| Permission | Why it is required |
|---|---|
| `sidePanel` | Displays FormatLens beside the active webpage. |
| `scripting` | Injects the local extraction helper when the user requests extraction or Pick Element mode. |
| `storage` | Saves only the user's light/dark/system theme choice. |
| HTTP/HTTPS host access | Allows extraction to work consistently on normal websites, including ServiceNow, even when the side panel is reopened through the browser UI. |

See the full [Privacy Policy](PRIVACY.md).

## Repository layout

```text
FormatLens-Extension/
├── extension/       Load this folder unpacked; ZIP its contents for Edge Add-ons
├── docs/            GitHub Pages website and public privacy policy
├── store-assets/    Store logo, promotional tiles, and screenshots
├── STORE_LISTING.md Copy-ready Partner Center listing and checklist
└── PRIVACY.md       Privacy policy source
```

## Create the Edge Add-ons ZIP

Open `extension/`, select everything inside it, and create a ZIP. The finished archive must have `manifest.json`, `background.js`, and the other extension files at its root—not inside an extra parent directory. Upload that package to Microsoft Partner Center.

## Publishing kit

- [Edge Add-ons submission copy and field-by-field checklist](STORE_LISTING.md)
- [Store artwork](store-assets)
- [Public privacy website](docs/privacy-policy.html)
- [Privacy policy source](PRIVACY.md)

## Privacy and security

FormatLens does not collect, sell, share, upload, or remotely process webpage content. Extracted content exists only in the open side panel and is discarded when that extension context is closed or reloaded. The only persistent setting is the chosen theme.

Security reports can be submitted through [GitHub Issues](https://github.com/sayanpramanik2012/FormatLens-Extension/issues).

## License

MIT License. See [LICENSE](LICENSE).
