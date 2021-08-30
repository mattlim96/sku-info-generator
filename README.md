# SKU Info Generator

## About The Project

### Problem
Colleagues were unable to retrieve current prices at scale because the latest data available from Buisness Intelligence team's database is up to the previous day's data. This resulted in inaccurate pricing submitted for promotions, causing double-work.

### Solution
Identified Shopee's public API for product information, and developed a Google Sheet tool that scrapes this *live* information at scale, it is called the SKU Info Generator.
The tool utilises Google Apps Script for web scraping and data manipulation, script was deployed on Google Cloud Platform for security purpose.

### Overview Methodology
1. Extract Shop ID and Product ID from user input(s).
2. Scrape product information from public API using `UrlFetchApp.fetchall()` or `UrlFetchApp.fetch()`.
3. Parse scraped JSON data and paste cleaned data into Google Sheets.

## Tool Description

View the tool [here](https://docs.google.com/spreadsheets/d/14wz4TupMTORjQtk5QUA6pfkCG9u1cVCpYRvyqfFxWNk/edit?usp=sharing) to better understand the following explanation.

The SKU Info Generator can scrape information at Product and Model Levels. The following explains the functions of each Googel Sheet tab:

Tab Name | Function
------------ | -------------
PRODUCT LEVEL (Formula) | Scrapes Product Level information via a customised function created in Apps Script, it follows the behaviour of a Google Sheet formula and refreshes the data periodically.
PRODUCT LEVEL (Button) | Scrapes Product Level information at scale via Apps Script.
MODEL LEVEL (Button) | Scrapes Model Level information at scale via Apps Script.

Video demonstration of tool coming soon...
