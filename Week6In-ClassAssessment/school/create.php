<?php
require 'db.php';
if ($_SERVER['REQUEST_METHOD']==='POST') {
  $stmt=$pdo->prepare("INSERT INTO schools (`School Name`,`City`,`Province`,`Phone`,`Email`)
                       VALUES (?,?,?,?,?)");
  $stmt->execute([$_POST['name'],$_POST['city'],$_POST['province'],$_POST['phone'],$_POST['email']]);
  header('Location: index.php'); exit;
}
?>
<h2>New School</h2>
<form method="post">
  Name:<input name="name"><br>
  City:<input name="city"><br>
  Province:<input name="province"><br>
  Phone:<input name="phone"><br>
  Email:<input name="email"><br>
  <button>Save</button>
</form>
