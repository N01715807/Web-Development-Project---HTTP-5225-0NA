<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week4: Foreach loop</title>
    <style>
    .color-row {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-weight: bold;
      color: white;
    }
  </style>
</head>
<body>
    <?php
        $connect = mysqli_connect(
            "localhost",
            "root",
            "",
            "csv_db 7"
        );

        if(!$connect){
            die("Connection failed: " . mysqli_connect_error());
        }

        $query = "SELECT * FROM colors";
        $result = mysqli_query($connect, $query);

        while ($row = mysqli_fetch_assoc($result)) {
            $name = $row['name'];$hex  = $row['hex'];
            echo '<div class="color-row" style="background-color:'.$hex.';">'.$name.'</div>';
        }
        mysqli_close($connect);

    ?>
</body>
</html>