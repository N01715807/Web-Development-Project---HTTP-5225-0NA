<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../src/config/db.php';

$country = $_GET['country'] ?? null;

if (!$country) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required parameter: country']);
  exit;
}

try {
  $stmt = $pdo->prepare("
    SELECT 
      languages.lang_code,
      languages.name_en,
      country_languages.status,
      country_languages.greet
    FROM 
      country_languages
    JOIN 
      languages ON country_languages.lang_code = languages.lang_code
    WHERE 
      country_languages.iso2 = ?
    ORDER BY 
      FIELD(country_languages.status, 'official','regional','widely_spoken','minority')
  ");
  $stmt->execute([$country]);
  $rows = $stmt->fetchAll();
  echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
?>
