# FormatLens

FormatLens turns dense JSON and technical text on any webpage into a readable side-panel view without sending the content anywhere.

![FormatLens promotional banner](store-assets/large-promo-1400x560.png)

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
5. Choose this repository folder—the folder that directly contains `manifest.json`.
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

## Build the assets and store package

```powershell
.\scripts\build-assets.ps1
.\scripts\package.ps1
```

The packaging script creates `release/FormatLens-v1.0.0-edge.zip` with `manifest.json` at the archive root. Upload that ZIP—not the repository ZIP—to Microsoft Partner Center.

## Publishing kit

- [Edge Add-ons submission copy and field-by-field checklist](STORE_SUBMISSION.md)
- [Store artwork](store-assets)
- [Public privacy website](docs/privacy.html)
- [Privacy policy source](PRIVACY.md)

## Privacy and security

FormatLens does not collect, sell, share, upload, or remotely process webpage content. Extracted content exists only in the open side panel and is discarded when that extension context is closed or reloaded. The only persistent setting is the chosen theme.

Security reports can be submitted through [GitHub Issues](https://github.com/sayanpramanik2012/FormatLens-Extension/issues).

## License

MIT License. See [LICENSE](LICENSE).
