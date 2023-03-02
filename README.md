# Figma Layout Overrides

A simple chrome extension to adjust the Figma website editor in a few areas, these are defined in `inject.css`:
1. Increase width of the Properties Panel
2. Increase width of Select Dropdown panels

![Screen recording showing the extension being run on several pages](demo-extension.gif)

## Notes
* The plugin will only function on Figma URLs that match this format `*://*.figma.com/*`
* If you are using multiple tabs at the same time, you might need to toggle the button to relaunch the extension.

## Local setup instructions
1. Download folder to your local machine
2. Open Chrome
3. Open the Extension Management page by navigating to chrome://extensions.
   - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
4. Enable Developer Mode by clicking the toggle switch next to Developer mode.
5. Click the LOAD UNPACKED button and select the extension directory.


## Roadmap
- [x] Widen properties panel
- [x] Widen select dropdowns
- [ ] Correct some of the quirks in the sidebar
