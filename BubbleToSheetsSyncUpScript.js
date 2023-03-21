/*The 'dataTypeCursorName' variable will contain the name of the data type which is present in the cursors sheet which 
will be used to fetch the cursor value of the data type.*/
/*The URL will contain the URL of the Bubble Store along with API key and data type name. 
For ex : https://domain.com/api/1.1/obj/datatype?api_token=XXXX&cursor=XXXX.
The value after the cursor will be updated after taking
the value from the 'Cursors' sheet.*/
/* headerArray will store all the keys of the json data as columns header name in the order which you want it to be displayed in sheet.
For ex : headerArray = ['headerOfCol1', 'headerOfcol2',etc] */
/*The variable 'sheetToBeUpdate' will contain the sheet name on which you want to update the data. It should be empty sheet by default. */


var headerArray = [];
var bubbleAPIURL = 'XXXXX'; //https://domain.com/api/1.1/obj/datatype?api_token=XXXX&cursor=
var dataTypeCursorName = 'XXXXX'; // eg:"Users"
var sheetToBeUpdated = 'XXXXX';// eg:"Users"


//this function will be the one that has to be called in app script to execute the entire script
fetchAndUpdateData(bubbleAPIURL,dataTypeCursorName,sheetToBeUpdated,headerArray);


// function to take the cursor value of the latest record to iterate further
function getCursor(dataType){
    var sheet = SpreadsheetApp.getActive().getSheetByName('Cursors');
    var data = sheet.getDataRange().getValues();
    for (var i = 0; i < data.length; i++) {
        if(dataType == data[i][0]){
          return data[i][1];
        }
    }
}

//function to update the cursor in the Cursors sheet with the latest cursor value
async function updateCursor(dataType,cursorValue){
    var sheet = SpreadsheetApp.getActive().getSheetByName('Cursors');
    var data = sheet.getDataRange().getValues();
    for (var i = 0; i < data.length; i++) {
        if(dataType == data[i][0]){
          var row = i+1;  
          await sheet.getRange(row, 2).setValue(cursorValue);
        }
    }
}


//populating the selected sheet with the Bubble Data
async function populateSheet(sheetName,headerArray,data){
    var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
    var currentSheetRows = sheet.getLastRow();

    //if the sheet is empty, then add the header row first
    if(currentSheetRows == 0 ){
        populateHeaders(sheet,headerArray);
    }

    //populating the data fields in the sheet
    finalDataArray = [];
    data.forEach(element => {
        var tempArray = [];
        //mapping the json fields with the particular header i.e the key so that the data is properly added
        for(var j=0;j<headerArray.length; j++){   
            tempArray.push(element[headerArray[j]]);    
        }
        finalDataArray.push(tempArray);
    });

    //populating the data fields in the sheet
    var nextRow = sheet.getLastRow()+1;
    await sheet.getRange(nextRow+1,1,data.length,headerArray.length).setValues(finalDataArray);
    
}


//function that takes the header Array and populate it as the headers of the sheet
async function populateHeaders(sheet,headerArray){  
    await sheet.getRange(1,1,1,headerArray.length).setValues([headerArray]);
}

//function to fetch the data from the Bubble API
function getDataFromAPI(url){
    var jsondata = UrlFetchApp.fetch(url, null);
    var object   = JSON.parse(jsondata.getContentText());
    return object;
}



function fetchAndUpdateData(bubbleAPIURL,dataTypeCursorName,sheetToBeUpdated,headerArray){
    /*fetching the current value of the cursor to fetch the data after the last updated data in sheets.*/
    var cursor = getCursor(dataTypeCursorName);
    console.log('The Current Cursor Value is: '+cursor);
    //fetching the data from the Bubble API
    var allData = getDataFromAPI(bubbleAPIURL+cursor);
    //getting the list of data from the API
    var data = allData['response']['results'];
    if(data.length != 0){
        //populating the sheet with the data
        populateSheet(sheetToBeUpdated,headerArray,data);
        //updating the cursor to the new value of the last updated data
        cursor = cursor + data.length;
        //updating the cursor in the 'Cursors' sheet for the particular data type.
        updateCursor(dataTypeCursorName,cursor);
        console.log('________________');
        //calling the function again to run the script until there are no more data to be fetched.
        fetchAndUpdateData(bubbleAPIURL,dataTypeCursorName,sheetToBeUpdated,headerArray);
    }
    else{
        //if the data is empty, then ending the script execution
        console.log('exiting');
        return;
    }
}