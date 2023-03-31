function getFromWeb() {
  // get data from API
  let response = JSON.parse(UrlFetchApp.fetch("https://mysite.com/api.php"));

  // get current list
  let ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SheetName');

  // Delete previous content
  let lr = ss.getLastRow(); // get last row
  let lc = ss.getLastColumn(); // get last column
  let clear = ss.getRange(1,1,lr,lc).clear({contentsOnly: true});

  // activate list
  ss.getRange(1,1).activate();

  // Loop ror result
  for (let i=0; i<response.length; i++) {
    ss.getRange("A"+i).setValues([[response[i].id]]);
    ss.getRange("B"+i).setValues([[response[i].name]]);
    ss.getRange("C"+i).setValues([[response[i].sum]]);
  }
}