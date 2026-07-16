<?php
$adminUser = require_login();
if (!in_array($adminUser['role'], ['admin','learn_manager','teacher'], true)) { http_response_code(403); exit('Forbidden'); }
$adminSections = [
    ['dashboard','Dashboard','/admin'],
    ['content','Content','/admin/content'],
    ['campaigns','Campaigns','/admin/campaigns'],
    ['donations','Donations','/admin/donations'],
    ['applications','Applications','/admin/applications'],
    ['users','Users','/admin/users'],
    ['media','Media library','/admin/media'],
    ['settings','Site settings','/admin/settings'],
];
$active = $active ?? 'dashboard';
$meta = page_meta('Admin — ' . ($pageTitle ?? 'Dashboard'), 'PYECSO administration');
?>
