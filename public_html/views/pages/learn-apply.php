<?php
$courseId = (int)($_GET['course_id'] ?? 0);
$course = $courseId ? q_one('SELECT * FROM content_items WHERE id = ? AND resource = "courses"', [$courseId]) : null;
if (!$course) { http_response_code(404); include __DIR__ . '/404.php'; exit; }

$user = current_user();
if (!$user) {
    $_SESSION['pending_apply'] = $courseId;
    redirect('/portal/register?next=' . urlencode("/learn/apply/$courseId"));
}

$ok = false; $err = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $name = trim($_POST['name'] ?? $user['full_name']);
    $email = trim($_POST['email'] ?? $user['email']);
    $phone = trim($_POST['phone'] ?? '');
    $msg = trim($_POST['message'] ?? '');
    if ($name && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        q('INSERT INTO course_applications (course_id, student_user_id, applicant_name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)',
          [$courseId, $user['id'], $name, $email, $phone, $msg]);
        unset($_SESSION['pending_apply']);
        $ok = true;
    } else { $err = 'Please provide your name and a valid email.'; }
}

$meta = page_meta('Apply — ' . $course['title'], $course['summary'] ?? '');
$eyebrow = null; $title = 'Apply: ' . $course['title']; $description = $course['summary'] ?? '';
ob_start(); include __DIR__ . '/../partials/hero.php'; ?>
<section class="slab">
  <div class="container" style="max-width:720px;">
    <?php if ($ok): ?>
      <div class="alert alert-ok">Application submitted. You can track it in <a href="/portal">your portal</a>.</div>
    <?php else: ?>
      <?php if ($err): ?><div class="alert alert-error"><?= h($err) ?></div><?php endif; ?>
      <form method="post" class="card">
        <?= csrf_field() ?>
        <div class="form-row"><label>Full name</label><input type="text" name="name" value="<?= h($user['full_name']) ?>" required></div>
        <div class="form-row"><label>Email</label><input type="email" name="email" value="<?= h($user['email']) ?>" required></div>
        <div class="form-row"><label>Phone</label><input type="tel" name="phone"></div>
        <div class="form-row"><label>Why do you want to join?</label><textarea name="message"></textarea></div>
        <button class="btn" type="submit">Submit application</button>
      </form>
    <?php endif; ?>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
