<?php
$json = file_get_contents("https://jsonplaceholder.typicode.com/users");
$info = json_decode($json, true);
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>User Cards</title>
<style>
  .box{border:1px solid orange;padding:20px;margin:20px;width:250px;display:inline-block;vertical-align:top}
  .name{font:600 18px system-ui}
  .muted{color:#666;font-size:14px}
</style>
</head>
<body>
<h1>User List</h1>

<?php
for($i=0; $i<count($info); $i++){
    $name = $info[$i]['name'];
    $email = $info[$i]['email'];
    $addr = $info[$i]['address']['street'].", ".$info[$i]['address']['city'];

    echo "<div class='box'>";
    echo "<div class='name'>$name</div>";
    echo "<div class='muted'>$email</div>";
    echo "<p>$addr</p>";
    echo "</div>";
}
?>

</body>
</html>