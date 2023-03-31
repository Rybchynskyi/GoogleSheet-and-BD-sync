<?php
//database settings
$host = 'localhost';
$db   = 'db_name';
$user = 'root';
$pass = 'root';
$charset = 'UTF8MB4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$pdo = new PDO($dsn, $user, $pass);

$sql_get_data = $pdo->query("SELECT * from `itemList`"); // your query

while ($row = $sql_get_data->fetch(PDO::FETCH_OBJ)) {

    $res[] = array(
        "id" => $row->id,
        "name" => $row->name,
        "sum" => $row->sum
    );
}

header('Content-type: application/json; charset=utf-8');
echo json_encode($res);

?>
