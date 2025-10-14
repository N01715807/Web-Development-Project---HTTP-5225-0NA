<?php
require 'db.php';

// 删除
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $stmt = $pdo->prepare("DELETE FROM schools WHERE id=?");
  $stmt->execute([$_POST['id']]);
}

$rows = $pdo->query("SELECT id, `School Name`, City, Province, Phone FROM schools ORDER BY id DESC")->fetchAll();
?>
<h2>Schools</h2>
<a href="create.php">+ Add</a>
<table border="1" cellpadding="6">
<tr><th>ID</th><th>Name</th><th>City</th><th>Province</th><th>Phone</th><th>Action</th></tr>
<?php foreach($rows as $r): ?>
<tr>
  <td><?= $r['id'] ?></td>
  <td><?= htmlspecialchars($r['School Name']) ?></td>
  <td><?= htmlspecialchars($r['City']) ?></td>
  <td><?= htmlspecialchars($r['Province']) ?></td>
  <td><?= htmlspecialchars($r['Phone']) ?></td>
  <td>
    <a href="edit.php?id=<?= $r['id'] ?>">Edit</a>
    <form method="post" style="display:inline" onsubmit="return confirm('Delete?');">
      <input type="hidden" name="id" value="<?= $r['id'] ?>">
      <button>Del</button>
    </form>
  </td>
</tr>
<?php endforeach; ?>
</table>
