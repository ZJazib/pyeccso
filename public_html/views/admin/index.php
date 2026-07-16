<?php
$active = 'dashboard'; $pageTitle = 'Dashboard';
include __DIR__ . '/_head.php';

$stats = [
  'users' => (int)q('SELECT COUNT(*) c FROM users')->fetchColumn(),
  'students' => (int)q('SELECT COUNT(*) c FROM users WHERE role = "student"')->fetchColumn(),
  'published' => (int)q('SELECT COUNT(*) c FROM content_items WHERE status = "published"')->fetchColumn(),
  'drafts' => (int)q('SELECT COUNT(*) c FROM content_items WHERE status = "draft"')->fetchColumn(),
  'pending' => (int)q('SELECT COUNT(*) c FROM course_applications WHERE status IN ("submitted","reviewing")')->fetchColumn(),
];
try { $stats['campaigns'] = (int)q('SELECT COUNT(*) c FROM donation_campaigns WHERE status = "published"')->fetchColumn(); } catch (Throwable $e) { $stats['campaigns'] = 0; }
try { $stats['raised_afn'] = (float)q('SELECT COALESCE(SUM(amount_afn),0) FROM donations WHERE status = "verified"')->fetchColumn(); } catch (Throwable $e) { $stats['raised_afn'] = 0; }

ob_start(); ?>
<div class="page-head"><h1>Dashboard</h1></div>
<div class="grid grid-4">
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= $stats['users'] ?></b><span class="muted">Users</span></div>
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= $stats['students'] ?></b><span class="muted">Students</span></div>
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= $stats['published'] ?></b><span class="muted">Published content</span></div>
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= $stats['drafts'] ?></b><span class="muted">Drafts</span></div>
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= $stats['pending'] ?></b><span class="muted">Pending applications</span></div>
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= $stats['campaigns'] ?></b><span class="muted">Active campaigns</span></div>
  <div class="card center"><b style="font-size:2rem;color:var(--primary);"><?= number_format($stats['raised_afn']) ?></b><span class="muted">Raised (AFN)</span></div>
</div>
<?php
$body = ob_get_clean();
ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean();
include __DIR__ . '/../partials/layout.php';
