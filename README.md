# Google-Sheets-App-Script-To-Sync-Bubble-IO-Data
This is a google app script to fetch the data from Bubble IO for any data type and update it. You can schedule a trigger in google app script to make sure this script runs everyday and it will update the data from Bubble IO to Google Sheets.


## To run this script on google app script, first you need to setup the sheets in a specified format. In Google Sheets, do the following :
  
  1. Create a sheet that will store the Bubble API data that will be empty by default.
  2. Create another sheet named **'Cursors'** that will store the index of the latest fetched record of the data type.
  3. In the **'Cursors'** sheet, add rows in the format Col1 : Data Type and Col2: Cursor Value. Refer to the example below :

      ![image](https://user-images.githubusercontent.com/23035152/227784270-92a59199-fa0b-40df-a54e-0ffba6860f55.png)


  4. Make sure the Cursor value is 0 if you are running the script for the first time so that the data gets updated from the start.
  5. Run the App Script on the sheet by adding the necessary URL, data type cursor info and sheet to be updated in the javascript file. The details and example are      present in the javascript files as well.
  
### For any queries or issues, kindly raise an issue on the repo.

### Contributions are always welcomed.
