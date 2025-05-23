# Advanced Figma options

[Figma UI Mod is a chrome extension](https://chrome.google.com/webstore/detail/figma-ui-mod/pakkdlcbmijjkcocojcgonopnbkeolle) to provide advanced options for Figma users, including:

**Changes**
* 27 April 2025: Fixed issue preventing CSV export for component analytics. Added inline download button to the analytic modals.
* 10 March 2025: Fixed issue preventing CSV export for component analytics. Add ability to export style analytics.
* 11 November 2024: Fixed issue preventing CSV export. Corrected "undefined" library title in Org Analytics modal.
* 23 September 2024: Fixed issue preventing CSV export.
* 12 August 2024: CSV export working with Figma UI3 changes.

**Export Analytics as CSV**
* Export library analytics as CSV
* Export component analytics as CSV
Note: Analytics modal needs to be visible on screen

**Enable several CSS overrides**
Adjust the Figma UI to make better of available space on larger viewports:
* Doubled the width of the Properties Panel (Right hand sidebar) – reduce truncation
* Wider Select Dropdowns – reduce truncation
* Increased the size of File Preview thumbnail – more space due to the wider sidebar
* Added horizontal scroll to the Layer List – avoid truncation of layer names
* Increased the size of Library Analytics modal – instead of a narrow modal it now takes up the full viewport
* Full screen branch review modal
* Swap instance picker enlarged – reduce truncation

**JS Bookmarklet**
For anyone unable to install Chrome extensions, here is a [javascript bookmarklet](https://gist.github.com/NoWorries/5c1763d6ad2ec784366d23b0880ae666) you can use to export the Figma Analytics.


**Donations**

Hope that you find this useful, if you want to say thanks you can [buy me a coffee](https://www.buymeacoffee.com/joshdesignnz).

**Images**

![Screenshot of the plugin enabled, showing the expanded Properties Panel and wider dropdown](images/chrome_store_1280x800.png)

![Figma Analytics modal is displayed on screen with an overlay showing how the content has been extracted to a CSV file](images/Figma_Analytics_-_Export_example.png)

![Two examples of CSV files exported by the plugin, showing details for a Library and a Componenent](images/CSV_examples.png)

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
- [x] Correct some of the quirks in the sidebar
- [x] Allow text overflow for layer name, and horizontal scroll
- [x] Reposition eyedropper
- [x] File preview image enlarged
- [x] Fullscreen analytics and library modal
- [x] Add Library Analytics export
- [x] Fullscreen branch review 

## Known limitations
* Color Styles (Grid view) - Color options set with positioned absolute in 6-column rows.
