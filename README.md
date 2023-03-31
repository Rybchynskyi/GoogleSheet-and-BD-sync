Quite often, it is necessary to upload data from Google Sheets to the website database, and vice versa, from the database to Google Sheets.

To achieve this purpose, we can use paid services. Because the table cannot be directly connected to the database.

However, there is another quite simple and free option to do this, by writing a script in Google sheet and a script for API on your website.

In this repository, you can see both scripts and modify it to fit the needs of your project. The API`s script is written in PHP, but you can adjust it to, for example, NodeJS.

## Case 1: Upload data from the Google sheet to the database
### Step 1: creating fetch request on Google sheet

Create a Google Sheet and fill it with data:

The first column, "Sync", is the checkout. Only marked data will be passed to the database via the API.
For creating checkout:

Create a script

Assign the script to a button

Write the script (ready-made script in the repository, sheet_to_bd_script.js)

Explanation of the main parts of the script:

```javascript
let ss = SpreadsheetApp.getActiveSpreadsheet();
let sheet = ss.getSheetByName("SheetName");
let rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
```
↗ Select the working area of the table that needs to be loaded into the database (without first row, because its a header for table)

```javascript
let jo = {};
let dataArray = [];
```
↗ Identify variables.
```javascript
for(let i = 1, l= rows.length; i<l ; i++){
    ...
  }
```
↗ Run a loop through all the data found in the rows area.
```javascript
if (dataRow[0] == true) {
    ...
    }
```
↗ Add only the values that were marked to the dataArray object.
```javascript
for(let k = 1; k < 10; k++) {
        ss.getSheetByName("SheetName").getRange(i+2,1).setValue('');
        ss.getSheetByName("SheetName").getRange(i+2, k).setBackground("#e2efd9");
      }
```
↗ Change the background for the values that will be synchronized with the database.
This is necessary to understand which data has been uploaded to the database in the future.
- "i" is selected row
- "k" is number of column in this row

#### Next, work with the created dataArray object.
```javascript
if (dataArray.length>0) {
    ...
  }
  else {
    let ui = SpreadsheetApp.getUi();
    ui.alert('Data is not selected');
  }
```
↗ The if-else statement checks if the fields were marked. If not, the user will see a message.
```javascript
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
```
↗ The last action is to send the created object through a fetch request to your website's API.

### Step 2: Create website API:
Create a page on the website that will receive your fetch request from Google script (ready-made script in the repository, sheet_to_bd_api.php)

Explanation of the main parts of the script:
```php
// JSON string
$someJSON = file_get_contents("php://input");
// Convert JSON string to Array
$postArray = json_decode($someJSON, true);
```
↗ Accepts JSON and decodes it.
```php
var_dump($postArray[0]);
```
↗ We can output the result to see it in the AppsScript console. This can be useful for viewing the received JSON during synchronization in Google Sheets.
```php
//database settings
$host = 'localhost';
$db   = 'db_name';
$user = 'root';
$pass = 'root';
$charset = 'UTF8MB4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$pdo = new PDO($dsn, $user, $pass);
```
↗ Connect to the database.
```php
for ($i=0; $i<count($postArray); $i++) {
    $sql_new_recive = "INSERT INTO `donate_list` (
                          `id`,
                          `name`,
                          `sum`
                          )
              VALUES (
                      '".$postArray[$i]["id"]."',
                      '".$postArray[$i]["name"]."',
                      '".$postArray[$i]["sum"]."')";
    
    $pdo->query($sql_new_recive);
}
```
↗ Loop through the objects and add them to the database

That's it. The data from the table has been transferred to the database.


## Case 2: Transferring information from the database to Google Sheets.

### Step 1: Creating an API on the website
Create a page on the website that will provide data from the database  (ready-made script in the repository, bd_to_sheet_api.php)

Explanation of the main parts of the script:

```php
$host = 'localhost';
$db   = 'db_name';
$user = 'root';
$pass = 'root';
$charset = 'UTF8MB4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$pdo = new PDO($dsn, $user, $pass);
```
↗ Connecting to your database.
```php
$sql_get_data = $pdo->query("SELECT * from `itemList`"); 
```
↗ Your SQL query. You can write any sql query
```php
while ($row = $sql_get_data->fetch(PDO::FETCH_OBJ)) {

    $res[] = array(
        "id" => $row->id,
        "name" => $row->name,
        "sum" => $row->sum
    );
}
```
↗ Adding all results to the $res array.
```php
header('Content-type: application/json; charset=utf-8');
echo json_encode($res);
```
↗ Converting the array to JSON and displaying it.

### Step 2: Writing a script for Google Sheets.
You can see the process of writing a script and assigning it to a button in Case 1.

Write the script in Google sheet (ready-made script in the repository, bd_to_sheet_script.js)

Explanation of the main parts of the script:
```javascript
let response = JSON.parse(UrlFetchApp.fetch("https://mysite.com/api.php"));
```
↗ Getting data from the website API.
```javascript
let ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SheetName');
```
↗ Activating the sheet where the results will be uploaded.
```javascript
  let lr = ss.getLastRow(); // get last row
  let lc = ss.getLastColumn(); // get last column
  let clear = ss.getRange(1,1,lr,lc).clear({contentsOnly: true});
```
↗ Deleting previous content from the sheet.
```javascript
ss.getRange(1,1).activate();
```
↗ Activating the first row of the first column to start adding data.
```javascript
  for (let i=0; i<response.length; i++) {
    ss.getRange("A"+i).setValues([[response[i].id]]);
    ss.getRange("B"+i).setValues([[response[i].name]]);
    ss.getRange("C"+i).setValues([[response[i].sum]]);
  }
```
↗ Looping through all retrieved data and adding it to the sheet.


Done! All data from the SQL query in the API has been transferred to Google Sheets.

