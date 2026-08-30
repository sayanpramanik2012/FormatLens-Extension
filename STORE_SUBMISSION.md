# Microsoft Edge Add-ons Submission Kit — FormatLens 1.0.0

This file contains the prepared values for Microsoft Partner Center. Review them once against the final uploaded package before submitting.

## Package and URLs

- **Package:** `release/FormatLens-v1.0.0-edge.zip`
- **Website:** `https://sayanpramanik2012.github.io/FormatLens-Extension/`
- **Privacy Policy URL:** `https://sayanpramanik2012.github.io/FormatLens-Extension/privacy.html`
- **Support URL:** `https://github.com/sayanpramanik2012/FormatLens-Extension/issues`
- **Source repository:** `https://github.com/sayanpramanik2012/FormatLens-Extension`

## Availability

- **Visibility:** Public
- **Markets:** All available markets
- **Pricing:** Free

## Properties

- **Category:** Developer Tools. If that category is unavailable in your Partner Center view, choose Productivity.
- **Mature content:** No
- **Website:** Use the Website URL above.
- **Support contact:** Use the Support URL above. Add your preferred support email only if Partner Center requires an email; no email is embedded in this repository.

## Store listing

### Extension name

FormatLens

### Short description

Format JSON and technical text in a private, local-only browser side panel.

### Full description

FormatLens makes dense JSON and technical text easier to understand without taking you away from the webpage you are working on. Select text, focus a field, or use Pick Element, then open a clean side-panel copy in Pretty, Tree, or Raw view.

It is especially useful for ServiceNow request and response payloads, API results, logs, configuration values, escaped JSON, and JSON nested inside strings. FormatLens automatically detects supported JSON, formats it with readable indentation and syntax highlighting, and creates a collapsible tree. Search across text, values, keys, and JSON paths; copy the complete formatted document or copy an individual value or path. Word wrapping and system, light, and dark themes are included.

Privacy is built into the design. Formatting, parsing, search, and copying happen locally in the browser. FormatLens has no backend, analytics, advertising, account requirement, remote code, or network transmission of webpage content. It reads page text only when you use its extraction controls.

Important limitation: browser-protected pages and some cross-origin iframe or isolated workspace fields cannot be inspected because browser security prevents extension access. Selecting or copying the field value directly remains the most reliable fallback.

### Search terms

JSON formatter, JSON viewer, pretty print, payload viewer, ServiceNow payload, developer tools, JSON tree, escaped JSON, technical text, API response

## Visual assets

| Partner Center field | File |
|---|---|
| Extension logo | `store-assets/store-logo-300.png` (300×300) |
| Small promotional tile | `store-assets/small-promo-440x280.png` |
| Large promotional tile | `store-assets/large-promo-1400x560.png` |
| Screenshot 1 | `store-assets/screenshot-1-pretty-1280x800.png` |
| Screenshot 2 | `store-assets/screenshot-2-tree-1280x800.png` |
| Screenshot 3 | `store-assets/screenshot-3-private-1280x800.png` |

## Privacy form

### Single purpose

FormatLens reads technical text that the user explicitly selects or chooses on the active webpage and presents a locally formatted, searchable Pretty, Tree, or Raw view in the browser side panel.

### Permission justifications

- **sidePanel:** Required to show the formatted technical-text viewer beside the active webpage without modifying the original page.
- **scripting:** Required to run the extension's bundled extraction helper after the user chooses Extract page text or Pick element.
- **storage:** Required only to save the user's system, light, or dark theme preference.
- **http://*/* and https://*/*:** Required because FormatLens is designed to inspect user-chosen technical text on arbitrary normal websites, including ServiceNow instances. Access is used only after the user invokes an extraction control and no page content is transmitted.

### Remote code

**No.** FormatLens does not execute remotely hosted code. All HTML, CSS, and JavaScript required by the extension is included in the submitted package.

### Data usage

- **User data collected:** None.
- FormatLens accesses user-chosen page text only for local, user-requested formatting.
- It does not transmit or persist extracted page content.
- It does not use data for advertising, analytics, profiling, creditworthiness, or unrelated purposes.
- It does not sell or transfer user data.
- The only persistent extension data is the non-sensitive theme preference stored locally.

Use the public Privacy Policy URL above even if the form considers the policy optional; the declared host access can trigger a privacy-policy requirement.

## Certification testing notes

FormatLens is a Manifest V3 side-panel extension with no account, backend, payment, region restriction, remote code, or test credentials.

Suggested test:

1. Open `https://json.org/example.html` or any normal HTTP/HTTPS page containing JSON.
2. Select a JSON block.
3. Click the FormatLens toolbar icon to open the side panel.
4. Select **Extract page text**.
5. Confirm that JSON is detected and formatted in Pretty view.
6. Open Tree view and expand nodes.
7. Use the Value and Path buttons, search, word wrap, Copy, and the theme control.
8. Test Pick Element on a visible `pre`, `code`, input, textarea, or contenteditable element.

All processing is local. Protected browser pages and cross-origin iframe content are intentionally inaccessible because of browser security restrictions.

## Final submission checklist

- [ ] Load the exact release ZIP unpacked in the latest stable Edge and perform the certification test above.
- [ ] Confirm the toolbar and Extensions page show the FormatLens icon.
- [ ] Confirm package version is `1.0.0` and `manifest.json` is at the ZIP root.
- [ ] Confirm the GitHub Pages website and privacy URL are publicly accessible.
- [ ] Upload the ZIP under Packages.
- [ ] Complete Availability, Properties, Privacy, and the `en-US` store listing.
- [ ] Upload the logo, both promotional tiles, and three screenshots.
- [ ] Paste the certification notes.
- [ ] Save every page, verify the language row shows Complete, then publish.
- [ ] Treat the submission as pending until Partner Center shows **In the Store**.

Official references: [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension) and [Microsoft Edge Add-ons developer policies](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies).
