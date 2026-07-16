<?php
$user = require_login();
$meta = page_meta('My portal', 'Your PYECSO portal');
$role = $user['role'];
$apps = [];
$materials = [];
$courses = [];
$applications_manager = [];

if ($role === 'student') {
    $apps = q_all('SELECT ca.*, ci.title AS course_title FROM course_applications ca LEFT JOIN content_items ci ON ci.id = ca.course_id WHERE ca.student_user_id = ? ORDER BY ca.created_at DESC', [$user['id']]);
    $materials = q_all('SELECT m.*, ci.title AS course_title FROM course_materials m LEFT JOIN content_items ci ON ci.id = m.course_id
                        WHERE m.visibility = "public" OR m.course_id IN (SELECT course_id FROM course_applications WHERE student_user_id = ? AND status = "accepted")
                        ORDER BY m.created_at DESC', [$user['id']]);
} elseif ($role === 'teacher') {
    $courses = q_all('SELECT * FROM content_items WHERE resource = "courses" ORDER BY id DESC');
    $materials = q_all('SELECT m.*, ci.title AS course_title FROM course_materials m LEFT JOIN content_items ci ON ci.id = m.course_id ORDER BY m.created_at DESC LIMIT 100');
} elseif ($role === 'learn_manager' || $role === 'admin') {
    $applications_manager = q_all('SELECT ca.*, ci.title AS course_title FROM course_applications ca LEFT JOIN content_items ci ON ci.id = ca.course_id ORDER BY ca.created_at DESC LIMIT 200');
    $courses = q_all('SELECT * FROM content_items WHERE resource = "courses" ORDER BY id DESC');
}

ob_start(); ?>
<section class="slab">
  <div class="container">
    <div class="flex">
      <div>
        <h1>Welcome, <?= h($user['full_name']) ?></h1>
        <p class="muted">Role: <span class="badge"><?= h($role) ?></span> · <?= h($user['email']) ?></p>
      </div>
      <div class="spacer"></div>
      <?php if ($role === 'admin'): ?><a class="btn btn-outline" href="/admin">Open admin panel</a><?php endif; ?>
      <a class="btn btn-outline" href="/portal/logout">Sign out</a>
    </div>

    <?php if ($role === 'student'): ?>
      <h2 class="mt-3">My applications</h2>
      <?php if (!$apps): ?><p class="muted">You haven't applied to any courses yet. <a href="/learn">Browse courses</a>.</p>
      <?php else: ?>
      <table class="table mt-2"><thead><tr><th>Course</th><th>Submitted</th><th>Status</th><th>Manager notes</th></tr></thead><tbody>
        <?php foreach ($apps as $a): ?>
          <tr><td><?= h($a['course_title'] ?? '—') ?></td><td><?= h($a['created_at']) ?></td>
              <td><span class="badge <?= $a['status'] === 'accepted' ? 'ok' : ($a['status'] === 'rejected' ? 'err' : 'warn') ?>"><?= h($a['status']) ?></span></td>
              <td><?= h($a['manager_notes'] ?? '') ?></td></tr>
        <?php endforeach; ?>
      </tbody></table>
      <?php endif; ?>

      <h2 class="mt-3">Course materials</h2>
      <?php if (!$materials): ?><p class="muted">No materials available yet.</p>
      <?php else: ?>
      <table class="table"><thead><tr><th>Course</th><th>Title</th><th>Size</th><th></th></tr></thead><tbody>
      <?php foreach ($materials as $m): ?>
        <tr><td><?= h($m['course_title'] ?? '') ?></td><td><?= h($m['title']) ?></td>
            <td><?= number_format($m['size_bytes']/1024, 1) ?> KB</td>
            <td><a class="btn btn-sm btn-outline" href="/api/material-download?id=<?= (int)$m['id'] ?>">Download</a></td></tr>
      <?php endforeach; ?>
      </tbody></table>
      <?php endif; ?>

    <?php elseif ($role === 'teacher'): ?>
      <h2 class="mt-3">Upload course material</h2>
      <form method="post" action="/api/material-upload" enctype="multipart/form-data" class="card">
        <?= csrf_field() ?>
        <div class="form-row"><label>Course</label><select name="course_id" required>
          <?php foreach ($courses as $c): ?><option value="<?= (int)$c['id'] ?>"><?= h($c['title']) ?></option><?php endforeach; ?>
        </select></div>
        <div class="form-row"><label>Title</label><input type="text" name="title" required></div>
        <div class="form-row"><label>Visibility</label><select name="visibility"><option value="enrolled">Enrolled students</option><option value="public">Public</option></select></div>
        <div class="form-row"><label>File</label><input type="file" name="file" required></div>
        <button class="btn" type="submit">Upload</button>
      </form>
      <h2 class="mt-3">Recent materials</h2>
      <table class="table"><thead><tr><th>Course</th><th>Title</th><th>Visibility</th><th>Uploaded</th></tr></thead><tbody>
      <?php foreach ($materials as $m): ?>
        <tr><td><?= h($m['course_title'] ?? '') ?></td><td><?= h($m['title']) ?></td>
            <td><?= h($m['visibility']) ?></td><td><?= h($m['created_at']) ?></td></tr>
      <?php endforeach; ?>
      </tbody></table>

    <?php elseif ($role === 'learn_manager' || $role === 'admin'): ?>
      <h2 class="mt-3">Course applications</h2>
      <table class="table"><thead><tr><th>Applicant</th><th>Course</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>
      <?php foreach ($applications_manager as $a): ?>
        <tr>
          <td><?= h($a['applicant_name']) ?><br><small class="muted"><?= h($a['email']) ?></small></td>
          <td><?= h($a['course_title'] ?? '—') ?></td>
          <td><?= h($a['created_at']) ?></td>
          <td><span class="badge <?= $a['status'] === 'accepted' ? 'ok' : ($a['status'] === 'rejected' ? 'err' : 'warn') ?>"><?= h($a['status']) ?></span></td>
          <td>
            <form method="post" action="/api/application-update" style="display:flex;gap:.25rem;">
              <?= csrf_field() ?>
              <input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
              <select name="status">
                <?php foreach (['submitted','reviewing','accepted','rejected'] as $s): ?>
                  <option value="<?= $s ?>" <?= $s === $a['status'] ? 'selected' : '' ?>><?= $s ?></option>
                <?php endforeach; ?>
              </select>
              <button class="btn btn-sm">Save</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody></table>
    <?php endif; ?>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
