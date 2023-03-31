<?php

// JSON string
$someJSON = file_get_contents("php://input");
// Convert JSON string to Array
$postArray = json_decode($someJSON, true);

var_dump($postArray[0]);

//database settings
$host = 'localhost';
$db   = 'db_name';
$user = 'root';
$pass = 'root';
$charset = 'UTF8MB4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$pdo = new PDO($dsn, $user, $pass);

for ($i=0; $i<count($postArray); $i++) {
    $sql_new_recive = "INSERT INTO `donate_list` (
                          `id`,
                          `name`,
                          `sum`
                          )
              VALUES (
                      NULL,
                      '".$postArray[$i]["id"]."',
                      '".$postArray[$i]["name"]."',
                      '".$postArray[$i]["sum"]."',
                      '".$date."')";

    $pdo->query($sql_new_recive);
}
echo "Success"

?>
