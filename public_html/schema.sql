-- =====================================================================
-- PYECSO — Full MySQL schema + seed data (cPanel)
-- Import once via phpMyAdmin: Import → choose this file → Go
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS and INSERT IGNORE
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. USERS  (admin / student / teacher / learn_manager)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  full_name VARCHAR(190) NOT NULL,
  role ENUM('admin','student','teacher','learn_manager') NOT NULL DEFAULT 'student',
  provider VARCHAR(40) NOT NULL DEFAULT 'password',
  google_sub VARCHAR(190) NULL UNIQUE,
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. CONTENT ITEMS  (pages / programs / projects / courses / media / careers)
--    One row per (resource, slug, language)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resource ENUM('pages','programs','projects','courses','media','careers') NOT NULL,
  slug VARCHAR(160) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'en',
  title VARCHAR(255) NOT NULL,
  summary TEXT NULL,
  body MEDIUMTEXT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  metadata_json JSON NULL,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_content_resource_slug_language (resource, slug, language),
  INDEX idx_content_resource_language_status (resource, language, status),
  CONSTRAINT fk_content_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_content_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. COURSE APPLICATIONS  (PYECSO Learn)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_applications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NULL,
  student_user_id BIGINT UNSIGNED NULL,
  applicant_name VARCHAR(190) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(80) NULL,
  message TEXT NULL,
  status ENUM('submitted','reviewing','accepted','rejected') NOT NULL DEFAULT 'submitted',
  manager_notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_applications_status (status),
  INDEX idx_applications_email (email),
  CONSTRAINT fk_applications_course FOREIGN KEY (course_id) REFERENCES content_items(id) ON DELETE SET NULL,
  CONSTRAINT fk_applications_student FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. AUDIT LOGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  target_type VARCHAR(80) NULL,
  target_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user_created (user_id, created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. COURSE MATERIALS  (teacher uploads, permission-gated downloads)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  original_name VARCHAR(255) NOT NULL,
  storage_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(160) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  visibility ENUM('enrolled','public') NOT NULL DEFAULT 'enrolled',
  uploaded_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_materials_course (course_id),
  CONSTRAINT fk_materials_course FOREIGN KEY (course_id) REFERENCES content_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_materials_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. DONATION CAMPAIGNS  (per-language rows)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donation_campaigns (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(160) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'en',
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  goal_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  raised_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  cover_image VARCHAR(500) NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_campaign_slug_lang (slug, language),
  KEY idx_campaign_status (status, language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 7. DONATIONS LEDGER  (HesabPay + cash + bank transfer)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  campaign_id INT UNSIGNED NULL,
  method ENUM('hesabpay','cash','bank_transfer','other') NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  amount_afn DECIMAL(14,2) NOT NULL DEFAULT 0,
  status ENUM('pending','verified','failed','refunded') NOT NULL DEFAULT 'pending',
  donor_name VARCHAR(160) NOT NULL,
  donor_email VARCHAR(160) NULL,
  donor_phone VARCHAR(60) NULL,
  reference VARCHAR(160) NULL,
  notes TEXT NULL,
  receipt_path VARCHAR(500) NULL,
  created_by INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_donations_campaign (campaign_id),
  KEY idx_donations_status (status),
  KEY idx_donations_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 8. MEDIA UPLOADS  (admin media library)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_uploads (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  kind VARCHAR(40) NOT NULL DEFAULT 'general',
  filename VARCHAR(200) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  uploaded_by INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_uploads_kind (kind),
  KEY idx_uploads_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 9. SITE SETTINGS  (key/value JSON, editable via admin panel)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) NOT NULL,
  value_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- ---- Site settings ----
INSERT IGNORE INTO site_settings (setting_key, value_json) VALUES
  ('contact',  '{"email":"info@pyecso.org.af","phone":"+93 700 000 000","address":"Kabul, Afghanistan"}'),
  ('social',   '{"facebook":"https://facebook.com/pyecso","x":"","linkedin":"","youtube":"","instagram":""}'),
  ('donation', '{"hesabpay_merchant_id":"","bank_name":"Afghanistan International Bank","bank_account_number":"0000-0000-0000","bank_account_name":"PYECSO","iban":"","swift":""}'),
  ('map',      '{"embed_url":"https://www.google.com/maps?output=embed&q=Kabul%2C%20Afghanistan"}'),
  ('branding', '{"site_name":"PYECSO","tagline":"Peace, Youth Empowerment & Civil Society Organization"}');

-- ---- Donation campaigns (5 languages × 3 campaigns) ----
INSERT IGNORE INTO donation_campaigns (slug, language, title, description, goal_amount, raised_amount, currency, cover_image, status, sort_order) VALUES
  -- Girls' Education
  ('girls-education','en','Girls\' Education Fund','Scholarships, books, and safe learning spaces for 200 girls this year.',25000,8400,'USD',NULL,'published',10),
  ('girls-education','fa','صندوق آموزش دختران','بورسیه، کتاب و فضای امن آموزشی برای ۲۰۰ دختر در امسال.',25000,8400,'USD',NULL,'published',10),
  ('girls-education','ps','د نجونو د زده‌کړې مالي مرسته','د ۲۰۰ نجونو لپاره بورسونه، کتابونه او خوندي زده‌کړیز چاپیریال.',25000,8400,'USD',NULL,'published',10),
  ('girls-education','ar','صندوق تعليم الفتيات','منح دراسية وكتب وبيئات تعليمية آمنة لـ 200 فتاة هذا العام.',25000,8400,'USD',NULL,'published',10),
  ('girls-education','fr','Fonds d\'éducation des filles','Bourses, livres et espaces d\'apprentissage sûrs pour 200 filles cette année.',25000,8400,'USD',NULL,'published',10),

  -- Youth Skills Training
  ('youth-skills','en','Youth Skills Training','Digital, English and vocational training for unemployed youth.',15000,4200,'USD',NULL,'published',20),
  ('youth-skills','fa','آموزش مهارت‌های جوانان','آموزش دیجیتال، انگلیسی و حرفه‌ای برای جوانان بیکار.',15000,4200,'USD',NULL,'published',20),
  ('youth-skills','ps','د ځوانانو مهارت روزنه','د بېکاره ځوانانو لپاره ډیجیټل، انګلیسي او مسلکي روزنه.',15000,4200,'USD',NULL,'published',20),
  ('youth-skills','ar','تدريب مهارات الشباب','تدريب رقمي وإنجليزي ومهني للشباب العاطلين عن العمل.',15000,4200,'USD',NULL,'published',20),
  ('youth-skills','fr','Formation des jeunes','Formation numérique, anglaise et professionnelle pour les jeunes sans emploi.',15000,4200,'USD',NULL,'published',20),

  -- Community Peace
  ('community-peace','en','Community Peace Program','Dialogue, mediation and civic engagement in five provinces.',10000,3100,'USD',NULL,'published',30),
  ('community-peace','fa','برنامه صلح جامعه','گفت‌وگو، میانجی‌گری و مشارکت مدنی در پنج ولایت.',10000,3100,'USD',NULL,'published',30),
  ('community-peace','ps','د ټولنیز سولې پروګرام','خبرې اترې، منځګړیتوب او مدني ګډون په پنځو ولایتونو کې.',10000,3100,'USD',NULL,'published',30),
  ('community-peace','ar','برنامج السلام المجتمعي','الحوار والوساطة والمشاركة المدنية في خمس ولايات.',10000,3100,'USD',NULL,'published',30),
  ('community-peace','fr','Programme de paix communautaire','Dialogue, médiation et engagement civique dans cinq provinces.',10000,3100,'USD',NULL,'published',30);

-- ---- Sample content: pages (About) in 5 languages ----
INSERT IGNORE INTO content_items (resource, slug, language, title, summary, body, status) VALUES
  ('pages','about','en','About PYECSO','Peace, Youth Empowerment & Civil Society Organization','PYECSO empowers youth and communities across Afghanistan through education, peacebuilding and civic participation.','published'),
  ('pages','about','fa','درباره PYECSO','سازمان صلح، توانمندسازی جوانان و جامعه مدنی','PYECSO از طریق آموزش، صلح‌سازی و مشارکت مدنی، جوانان و جوامع را در سراسر افغانستان توانمند می‌سازد.','published'),
  ('pages','about','ps','د PYECSO په اړه','د سولې، د ځوانانو د پیاوړتیا او مدني ټولنې سازمان','PYECSO د زده‌کړې، سولې جوړونې او مدني ګډون له لارې د افغانستان په ټول قلمرو کې ځوانان او ټولنې پیاوړي کوي.','published'),
  ('pages','about','ar','حول PYECSO','منظمة السلام وتمكين الشباب والمجتمع المدني','تقوم PYECSO بتمكين الشباب والمجتمعات في جميع أنحاء أفغانستان من خلال التعليم وبناء السلام والمشاركة المدنية.','published'),
  ('pages','about','fr','À propos de PYECSO','Organisation pour la paix, l\'autonomisation des jeunes et la société civile','PYECSO autonomise les jeunes et les communautés à travers l\'Afghanistan par l\'éducation, la consolidation de la paix et la participation civique.','published');

-- ---- Sample programs ----
INSERT IGNORE INTO content_items (resource, slug, language, title, summary, status) VALUES
  ('programs','education','en','Education & Literacy','Community schools, teacher training and adult literacy.','published'),
  ('programs','peace','en','Peacebuilding','Dialogue, mediation and reconciliation at the community level.','published'),
  ('programs','youth','en','Youth Empowerment','Leadership, entrepreneurship and civic engagement for youth.','published'),
  ('programs','women','en','Women\'s Rights','Advocacy, legal aid and economic opportunity for women and girls.','published');

-- ---- Sample courses (PYECSO Learn) ----
INSERT IGNORE INTO content_items (resource, slug, language, title, summary, body, status, metadata_json) VALUES
  ('courses','english-a1','en','English Language — Level A1','8-week beginner English course, twice weekly.','Learn foundational grammar, vocabulary and conversation in a supportive classroom.','published','{"duration":"8 weeks","level":"Beginner","seats":25,"start_date":"2026-09-01"}'),
  ('courses','digital-literacy','en','Digital Literacy Bootcamp','Practical computer, internet and productivity skills.','Windows basics, Google Workspace, safe internet use and simple data entry with Excel.','published','{"duration":"6 weeks","level":"Beginner","seats":20,"start_date":"2026-09-15"}'),
  ('courses','leadership','en','Youth Leadership Workshop','4-week intensive workshop on leadership and civic engagement.','Facilitation, public speaking, project design and community mobilization.','published','{"duration":"4 weeks","level":"Intermediate","seats":30,"start_date":"2026-10-01"}');

-- ---- Sample projects ----
INSERT IGNORE INTO content_items (resource, slug, language, title, summary, status) VALUES
  ('projects','school-rehab-2025','en','Community School Rehabilitation 2025','Rehabilitating 6 rural schools serving 1,800 children.','published'),
  ('projects','women-cooperatives','en','Women\'s Cooperatives Initiative','Supporting 12 women-led cooperatives with training and micro-grants.','published');

-- ---- Sample career opening ----
INSERT IGNORE INTO content_items (resource, slug, language, title, summary, body, status, metadata_json) VALUES
  ('careers','program-officer-education','en','Program Officer — Education','Kabul-based, full-time. Support education program delivery and monitoring.','Requirements: BA + 3 years NGO experience, English + Dari/Pashto, willingness to travel.','published','{"location":"Kabul","type":"Full-time","deadline":"2026-08-15"}');

-- =====================================================================
-- DONE. Next step: visit /setup to create the first admin user.
-- =====================================================================
