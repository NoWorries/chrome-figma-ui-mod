// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";


function executeScriptBasedOnModals() {

  var exportData = false;
  var exportTab = "";

  if (document.querySelector('[class*="dsa_file_view_modal--container--"]')) {
    console.log("------");
    console.log("✅ Library Analytics: Open");

    var exportData = true;

    if (
      document.querySelector('[class*="dsa_file_view_overview--fileViewDSA--"]')
    ) {
      console.log("❌ Visible: Overview");
      alert("ℹ️ Switch to the Analytics tab to export data.");
    } else if (
      document.querySelector('[class*="dsa_file_view_v2--slidingPaneLeft--"]')
    ) {
      console.log("✅ Visible: Component detail");
      var exportTab = "Component Detail";
    } else if (
      document.querySelector(
        '[class*="dsa_file_view_analytics--fileViewDSA--"]'
      )
    ) {
      console.log("✅ Visible: All components");
      var exportTab = "Component List";
    
    }
  } else {
    alert("Library Analytics modal is not visible.");
    console.log("❌ Library Analytics: Closed");
  }



  if ( exportData && exportTab == "Component Detail") {
      // Call the function for element1
     // functionForElement1();
     // alert("component page");

      // Export Figma Component Analytics

      // Scrape content from the webpage
      const containerDiv = document.querySelector('div[class*="library_item_stats--allComponentsTable--"]');
      const rows = Array.from(containerDiv.querySelectorAll('div[class*="library_item_stats--row--"]'));

      // Extract table headings
      const headerRow = containerDiv.querySelector('div[class*="library_item_stats--headerRowAllComponentTable--"]');
      const headings = Array.from(headerRow.querySelectorAll('div[class^="entity--sortableField--"]')).map(heading => heading.textContent.trim());

      // Extract data from each row
      const data = rows.map(row => {
        const avatarColumn = row.querySelector('div[class*="library_item_stats--avatarColumnComponentName--"]');
        const componentName = avatarColumn.textContent.trim();
        const statsColumns = Array.from(row.querySelectorAll('div[class*="library_item_stats--statsColVal--"]')).map(column => column.textContent.trim());
        return [componentName, ...statsColumns];
      });

      // Get current date
      const currentDate = new Date().toISOString().split('T')[0];

      // Get the text from the div with the partial classname
      const headerTitle = document.querySelector('div[class*="header_modal--headerModalTitle--"]').textContent.trim();

      // Get the component title
      const componentTitle = document.querySelector('div[class*="component_file_view_header--name--"]').textContent.trim();

      // Extract additional content
      const description = document.querySelector('div[class*="overview_stats_view--componentDescription--"]').textContent.trim();
      const total = document.querySelector('div[class*="overview_stats_view--stat--"]').textContent.trim();
      const usedBy = document.querySelectorAll('div[class*="overview_stats_view--stat--"]')[1].textContent.trim();
      const usedIn = document.querySelectorAll('div[class*="overview_stats_view--stat--"]')[2].textContent.trim();

      // Prepend additional content to data
      const prependedData = [
        ['Library', headerTitle],
        ['Date', currentDate],
        ['Name', componentTitle],
        ['Description', description],
        ['Total', total],
        ['Used by', usedBy],
        ['Used in', usedIn],
        [],
      ];

      // Combine prependedData with existing data
      const combinedData = [...prependedData, headings, ...data];

      // Create CSV content
      const csvComponentContent = `${combinedData.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')}`;

      // Replace spaces and special characters with underscores
      const cleanedHeaderTitle = headerTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanedComponentTitle = componentTitle.replace(/[^a-zA-Z0-9]/g, "_");

      // Generate the filename with today's date and the cleaned header title
      const fileNameDetail = `Figma-Component-Analytics_-_${cleanedHeaderTitle}_-_${cleanedComponentTitle}_-_${currentDate}.csv`;

      // Create a Blob object to download the CSV file
      const blob = new Blob([csvComponentContent], { type: 'text/csv;charset=utf-8;' });



      // Create a temporary link element to initiate the download
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileNameDetail);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("📄 Exporting: "+fileNameDetail+"");
      }


    } else if (exportData && exportTab == "Component List") {

      // Export Figma Library Analytics

      // Scrape content from the webpage
      const containerDiv = document.querySelector('div[class*="library_item_stats--allComponentsTable--"]');
      const rows = Array.from(containerDiv.querySelectorAll('div[class*="library_item_stats--row--"]'));

      // Extract table headings
      const headerRow = containerDiv.querySelector('div[class*="library_item_stats--headerRowAllComponentTable--"]');
      const headings = Array.from(headerRow.querySelectorAll('div[class^="entity--sortableField--"]')).map(heading => heading.textContent.trim());

      // Extract data from each row
      const data = rows.map(row => {
        const avatarColumn = row.querySelector('div[class*="library_item_stats--avatarColumnComponentName--"]');
        const componentName = avatarColumn.textContent.trim();
        const statsColumns = Array.from(row.querySelectorAll('div[class*="library_item_stats--statsColVal--"]')).map(column => column.textContent.trim());
        return [componentName, ...statsColumns];
      });

      // Get current date
      const currentDate = new Date().toISOString().split('T')[0];

      // Get the text from the div with the partial classname
      const headerElement = document.querySelector('div[class*="header_modal--headerModalTitle--"]');
      const headerTitle = headerElement ? headerElement.textContent.trim() : "Undefined";

      // Get the date range from the div with the partial classname
      const headerDateRange = document.querySelector('span[class*="dsa_file_view_tabs--duration--"]').textContent.trim();

      // Prepend additional content to data
      const prependedData = [
        ['Library', headerTitle],
        ['Date', currentDate],
        ['Date range', headerDateRange],
        [],
      ];

      // Combine prependedData with existing data
      const combinedData = [...prependedData, headings, ...data];

      // Create CSV content
      const csvContent = `${combinedData.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')}`;


      // Replace spaces and special characters with underscores
      const cleanedHeaderTitle = headerTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanedDateRange = headerDateRange.replace(/[^a-zA-Z0-9]/g, "_");

      // Generate the filename with today's date and the cleaned header title
      const fileName = `Figma-Analytics_-_${cleanedHeaderTitle}_-_${cleanedDateRange}_-_${currentDate}.csv`;

      // Create a Blob object to download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });



      // Create a temporary link element to initiate the download
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("📄 Exporting: "+fileName+"");
      }




    }
}

// Receive message from the extension popup to execute the script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === 'executeScript') {
    executeScriptBasedOnModals();
  }
});
