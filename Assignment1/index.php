<?php include "includes/db_connect.php"; ?>
<?php include "includes/header.php"; ?>

<h1>movies list</h1>
<div class="movies">

<?php
$query = "SELECT * FROM movies ORDER BY rating";
$result = mysqli_query($connect, $query);

while($row = mysqli_fetch_assoc($result)) {
    echo '<div class="card">';
    echo '<h2>' . htmlspecialchars($row['title']) . '</h2>';
    echo '<p>' 
       . htmlspecialchars($row['director']) .' '
       . htmlspecialchars($row['release_year']) . ' '
       . htmlspecialchars($row['rating']) 
       . '</p>';
    echo '<img src="' . htmlspecialchars($row['poster_url']) . '" alt="Movie Poster" class="poster">';
    echo '</div>';
};

mysqli_free_result($result);
?>

<?php include "includes/footer.php"; ?>

mysqli_close($connect);