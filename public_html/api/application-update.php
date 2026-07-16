<?php
// POST /api/application-update — manager/admin updates course_applications
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
csrf_check();
$user = require_login();
if (!in_array($user['role'], ['learn_manager','admin'], true)) { http_response_code(403); exit('Forbidden'); }
q('UPDATE course_applications SET status = ?, manager_notes = COALESCE(NULLIF(?, ""), manager_notes) WHERE id = ?',
  [$_POST['status'] ?? 'submitted', trim($_POST['manager_notes'] ?? ''), (int)($_POST['id'] ?? 0)]);
redirect('/portal');
