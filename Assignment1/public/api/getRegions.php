<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../src/config/db.php';

$dialect = $_GET['dialect_id'] ?? null;

if (!$dialect) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required parameter: dialect_id']);
  exit;
}

try {
  $stmt = $pdo->prepare("
    SELECT 
      dialect_regions.region_code,
      regions.province_en,
      dialect_regions.coverage
    FROM 
      dialect_regions
    JOIN 
      regions ON dialect_regions.region_code = regions.iso_3166_2
    WHERE 
      dialect_regions.dialect_code = ?
    ORDER BY 
      regions.province_en
  ");
  $stmt->execute([$dialect]);
  $rows = $stmt->fetchAll();

  $result = [
    'dialect_id' => $dialect,
    'regions' => array_column($rows, 'region_code'),
    'details' => $rows
  ];

  echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
?>
