<?php
// GET /api/material-download?id=NN — enforces visibility rules.
$user = require_login();
$id = (int)($_GET['id'] ?? 0);
$m = q_one('SELECT * FROM course_materials WHERE id = ?', [$id]);
if (!$m) { http_response_code(404); exit; }

if ($m['visibility'] === 'enrolled' && !in_array($user['role'], ['admin','teacher','learn_manager'], true)) {
    $ok = q_one('SELECT id FROM course_applications WHERE course_id = ? AND student_user_id = ? AND status = "accepted"', [$m['course_id'], $user['id']]);
    if (!$ok) { http_response_code(403); exit('Not enrolled'); }
}

$path = $GLOBALS['CONFIG']['site']['uploads_dir'] . '/materials/' . $m['storage_name'];
if (!is_file($path)) { http_response_code(404); exit('File missing'); }

header('Content-Type: ' . $m['mime_type']);
header('Content-Length: ' . filesize($path));
header('Content-Disposition: attachment; filename="' . basename($m['original_name']) . '"');
readfile($path);
