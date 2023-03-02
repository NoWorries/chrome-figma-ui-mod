# XUI Chrome extension

A simple chrome extension to visually highlight the use of the XUI design system on Xero websites. This shows in two ways:
1. An outline added to known component containers, these are defined in `inject.css`
2. A colour applied to text that is either using specific XUI classes or will inherit them from the component they are within.
An alert will inform the user if there are any XUI stylesheets loaded on the page, and their full path.

![Screen recording showing the extension being run on several pages](demo-extension.gif)

## Notes
* The plugin will only function on Xero URLs that match this format `*://*.xero.com/*`
* The alert will fire when the action button is clicked
* If you are using multiple tabs at the same time, you might need to toggle the button to relaunch the extension.

## Local setup instructions
1. Download folder to your local machine
2. Open Chrome
3. Open the Extension Management page by navigating to chrome://extensions.
   - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
4. Enable Developer Mode by clicking the toggle switch next to Developer mode.
5. Click the LOAD UNPACKED button and select the extension directory.


## Roadmap
- [x] Highlight XUI elements with CSS
- [x] Report any CSS files loaded that have `xui` in the file path
- [ ] Prevent alerts when not on a matching URL, perhaps indicate with icon change to `xui_32_off.png`
- [ ] Improve on/off state per tab, reduce need to relaunch action.
