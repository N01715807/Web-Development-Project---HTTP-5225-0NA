<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "movies_list";

$connect = mysqli_connect($host, $user, $pass, $db);

if (!$connect) {
    die("Database Connection Failed: " . mysqli_connect_error());
}

mysqli_set_charset($connect, "utf8mb4");
?>