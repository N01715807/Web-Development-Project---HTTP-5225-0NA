<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assignment 1: PHP and MySQL</title>
    <style>

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
  color: #333;
}

h1 {
  text-align: center;
  padding: 20px;
  margin: 0;
  background-color: #222;
  color: #fff;
}


.movies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  gap: 20px; 
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 15px;
  width: 220px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.card h2 {
  font-size: 18px;
  margin: 10px 0;
  color: #222;
}

.card p {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
}

.card img.poster {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin-top: 10px;
}

    </style>
</head>
<body>
    <main>