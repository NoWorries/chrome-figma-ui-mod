// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";


function executeScriptBasedOnModals() {
  if (document.querySelector('[class*="component_file_view_header--header--"]')) {
      // Call the function for element1
     // functionForElement1();
     // alert("component page");

      // Export Figma Component Analytics

      // Scrape content from the webpage
      const containerDiv = document.querySelector('div[class*="library_item_view--fileViewDSANoTab--"] div[class*="library_item_stats--allComponentsTable--"]');
      const rows = Array.from(containerDiv.querySelectorAll('div[class*="library_item_view--fileViewDSANoTab--"] div[class*="library_item_stats--row--"]'));

      // Extract table headings
      const headerRow = containerDiv.querySelector('div[class*="library_item_stats--headerRowAllComponentTable--"]');
      const headings = Array.from(headerRow.querySelectorAll('div[class^="entity--sortableField--"]')).map(heading => heading.textContent.trim());

      // Extract data from each row
      const data = rows.map(row => {
        const avatarColumn = row.querySelector('div[class*="library_item_view--fileViewDSANoTab--"] div[class*="library_item_stats--avatarColumnComponentName--"]');
        const componentName = avatarColumn.textContent.trim();
        const statsColumns = Array.from(row.querySelectorAll('div[class*="library_item_view--fileViewDSANoTab--"] div[class*="library_item_stats--statsColVal---"]')).map(column => column.textContent.trim());
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
      //const csvComponentContent = `${headings.map(value => `"${value.replace(/"/g, '""')}"`).join(',')}\n${combinedData.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')}`;



      // Replace spaces and special characters with underscores
      const cleanedHeaderTitle = headerTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanedComponentTitle = componentTitle.replace(/[^a-zA-Z0-9]/g, "_");

      // Generate the filename with today's date and the cleaned header title
      const fileName = `Figma-Component-Analytics_-_${cleanedHeaderTitle}_-_${cleanedComponentTitle}_-_${currentDate}.csv`;

      // Create a Blob object to download the CSV file
      const blob = new Blob([csvComponentContent], { type: 'text/csv;charset=utf-8;' });



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
      }


    } else if (document.querySelector('[class*="library_analytics_view--teamUsageContainer--"]')) {
      // Call the function for element2
     // functionForElement2();
     // alert("library page");

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
        const statsColumns = Array.from(row.querySelectorAll('div[class*="library_item_stats--statsColVal---"]')).map(column => column.textContent.trim());
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
      }


    } else {
      // Neither element is visible
      
      alert("You can only export results when Library Analytics or Component Analytics are visible.");
    }
}

// Receive message from the extension popup to execute the script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === 'executeScript') {
    executeScriptBasedOnModals();
  }
});