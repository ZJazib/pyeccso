<?php
// POST /api/material-upload (teachers/admin)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
csrf_check();
$user = require_login();
if (!in_array($user['role'], ['teacher','admin','learn_manager'], true)) { http_response_code(403); exit('Forbidden'); }

$courseId = (int)($_POST['course_id'] ?? 0);
$title = trim($_POST['title'] ?? '');
$visibility = ($_POST['visibility'] ?? 'enrolled') === 'public' ? 'public' : 'enrolled';
if (!$courseId || !$title || empty($_FILES['file']['tmp_name'])) { http_response_code(400); exit('Missing fields'); }

$dir = $GLOBALS['CONFIG']['site']['uploads_dir'] . '/materials';
if (!is_dir($dir)) @mkdir($dir, 0755, true);
$orig = $_FILES['file']['name'];
$ext = pathinfo($orig, PATHINFO_EXTENSION);
$safe = bin2hex(random_bytes(10)) . '.' . preg_replace('/[^a-z0-9]/i', '', $ext);
$target = $dir . '/' . $safe;
if (!move_uploaded_file($_FILES['file']['tmp_name'], $target)) { http_response_code(500); exit('Upload failed'); }
q('INSERT INTO course_materials (course_id, title, description, original_name, storage_name, mime_type, size_bytes, visibility, uploaded_by) VALUES (?,?,?,?,?,?,?,?,?)',
  [$courseId, $title, $_POST['description'] ?? null, $orig, $safe, mime_content_type($target) ?: 'application/octet-stream', filesize($target), $visibility, $user['id']]);
redirect('/portal');
