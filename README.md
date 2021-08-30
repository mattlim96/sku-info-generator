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

## Demonstration

Video demonstration of tool coming soon...

View the tool [here](https://docs.google.com/spreadsheets/d/14wz4TupMTORjQtk5QUA6pfkCG9u1cVCpYRvyqfFxWNk/edit?usp=sharing)!
