<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../src/config/db.php';

$language = $_GET['language'] ?? null;

if (!$language) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required parameter: language']);
  exit;
}

try {
  $stmt = $pdo->prepare("
    SELECT 
      dialects.dialect_code,
      dialects.dialect_en,
      dialects.notes
    FROM 
      dialects
    WHERE 
      dialects.language_code = ?
    ORDER BY 
      dialects.dialect_en
  ");
  $stmt->execute([$language]);
  $rows = $stmt->fetchAll();
  echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
?>