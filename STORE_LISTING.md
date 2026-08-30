# Microsoft Edge Add-ons listing — FormatLens

Prepared submission copy for FormatLens 1.0.0.

## URLs

- **Website:** https://sayanpramanik2012.github.io/FormatLens-Extension/
- **Privacy policy:** https://sayanpramanik2012.github.io/FormatLens-Extension/privacy-policy.html
- **Support:** https://github.com/sayanpramanik2012/FormatLens-Extension/issues
- **Source:** https://github.com/sayanpramanik2012/FormatLens-Extension
- **Store listing:** Pending publication

## Store properties

- **Category:** Developer Tools
- **Pricing:** Free
- **Markets:** All available markets
- **Mature content:** No

## Extension name

FormatLens

## Short description

Format JSON and technical text in a private, local browser side panel.

## Description

FormatLens makes dense JSON and technical text easier to inspect without leaving the webpage.

Select text, focus a field, or use Pick element. FormatLens opens the content in a browser side panel with Pretty, Tree, and Raw views. It detects standard, escaped, and nested JSON; searches text, keys, values, and JSON paths; and copies a complete document, one value, or an exact path.

FormatLens is useful for ServiceNow payloads, API responses, logs, and configuration values. Word wrapping and system, light, and dark themes are included.

All formatting and search happen locally. FormatLens has no account, backend, analytics, advertising, remote code, or transmission of webpage content. It reads page text only after the user requests extraction.

Browser-protected pages and some cross-origin or isolated iframe content cannot be inspected because of browser security restrictions.

## Search terms

- JSON formatter
- JSON viewer
- Payload viewer
- JSON tree
- ServiceNow payload
- API response
- Developer tools

## Visual assets

| Partner Center field | File |
|---|---|
| Extension logo | `store-assets/extension-logo-300.png` |
| Small promotional tile | `store-assets/small-promotional-tile-440x280.png` |
| Large promotional tile | `store-assets/large-promotional-tile-1400x560.png` |
| Screenshot 1 | `store-assets/screenshot-1-pretty-1280x800.png` |
| Screenshot 2 | `store-assets/screenshot-2-tree-1280x800.png` |
| Screenshot 3 | `store-assets/screenshot-3-private-1280x800.png` |

## Privacy form

### Single purpose

FormatLens reads technical text chosen by the user and presents a locally formatted, searchable Pretty, Tree, or Raw view in the browser side panel.

### Permission justifications

- **`sidePanel`:** displays FormatLens beside the active webpage.
- **`scripting`:** runs the packaged extraction helper after the user selects Extract page text or Pick element.
- **`storage`:** saves only the system, light, or dark theme preference.
- **HTTP/HTTPS website access:** reads user-chosen technical text on ordinary websites. Access is used only after the user invokes extraction.

### Remote code

No. All HTML, CSS, and JavaScript used by FormatLens is included in the extension package.

### Data usage

- User data collected: None.
- Extracted page content is processed locally and is not transmitted or persisted.
- Data is not used for advertising, analytics, profiling, creditworthiness, or unrelated purposes.
- The only persistent extension data is the local theme preference.

## Certification notes

1. Open a normal HTTP/HTTPS page containing JSON.
2. Select a JSON block.
3. Open FormatLens from the toolbar.
4. Select **Extract page text**.
5. Confirm the content appears in Pretty view.
6. Test Tree and Raw views, search, copy, word wrap, Pick element, and the theme control.

No account, payment, backend, region restriction, or test credential is required. Protected browser pages and cross-origin iframe content are intentionally inaccessible.

## Submission checklist

- [ ] ZIP the contents of `extension/` with `manifest.json` at the archive root.
- [ ] Load the exact package unpacked in the latest stable Edge and run the certification test.
- [ ] Confirm version `1.0.0` and all extension icons.
- [ ] Confirm the website, privacy policy, and support links are public.
- [ ] Upload the package and store artwork.
- [ ] Complete Availability, Properties, Privacy, and the `en-US` listing.
- [ ] Add the final Edge Add-ons URL to the website and this file after publication.
- [ ] Publish and wait until Partner Center reports **In the Store**.
