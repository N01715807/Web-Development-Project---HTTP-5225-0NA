<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../src/config/db.php';

try {
  $stmt = $pdo->query('SELECT iso2, name_en FROM countries ORDER BY name_en');
  $rows = $stmt->fetchAll();
  echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}