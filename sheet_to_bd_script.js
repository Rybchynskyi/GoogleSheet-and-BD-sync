function postRequestNew() {
  // get working area
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("SheetName");
  let rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();

  // Identify variables
  let jo = {};
  let dataArray = [];

  // collecting data from 2nd Row , 1st column to last row and last column
  for(let i = 1, l= rows.length; i<l ; i++){
    let dataRow = rows[i];
    let record = {};
    if (dataRow[0] == true) { // if checkbox in table is 'on'
      record['id'] = dataRow[2];
      record['name'] = dataRow[3];
      record['sum'] = dataRow[4];

      dataArray.push(record); // add selected row to array
      Logger.log(dataArray); // if you want to see result while script will be running

      // change color checked rows
      for(let k = 1; k < 10; k++) {
        ss.getSheetByName("SheetName").getRange(i+2,1).setValue('');
        ss.getSheetByName("SheetName").getRange(i+2, k).setBackground("#e2efd9");
      }
    }
  }

  // fetch result to te website
  if (dataArray.length>0) {
    jo = dataArray;
    let options = {
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(jo)
    };
    let response = UrlFetchApp.fetch('https://yoursite.com/api.php', options);
    Logger.log(response.getContentText()); // if you want to see result while script will be running
    let ui = SpreadsheetApp.getUi(); // get ui for alert
    ui.alert('Done');
  }
  // if data was not selected
  else {
    let ui = SpreadsheetApp.getUi(); // get ui for alert
    ui.alert('Data is not selected');
  }
}


