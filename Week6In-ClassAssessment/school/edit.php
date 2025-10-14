<?php
require 'db.php';
$id=$_GET['id']??0;
$stmt=$pdo->prepare("SELECT * FROM schools WHERE id=?");
$stmt->execute([$id]);
$r=$stmt->fetch();

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $stmt=$pdo->prepare("UPDATE schools SET `School Name`=?,City=?,Province=?,Phone=?,Email=? WHERE id=?");
  $stmt->execute([$_POST['name'],$_POST['city'],$_POST['province'],$_POST['phone'],$_POST['email'],$id]);
  header('Location: index.php'); exit;
}
?>
<h2>Edit School</h2>
<form method="post">
  Name:<input name="name" value="<?= htmlspecialchars($r['School Name']) ?>"><br>
  City:<input name="city" value="<?= htmlspecialchars($r['City']) ?>"><br>
  Province:<input name="province" value="<?= htmlspecialchars($r['Province']) ?>"><br>
  Phone:<input name="phone" value="<?= htmlspecialchars($r['Phone']) ?>"><br>
  Email:<input name="email" value="<?= htmlspecialchars($r['Email']) ?>"><br>
  <button>Update</button>
</form>
