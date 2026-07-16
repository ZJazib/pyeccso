CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  full_name VARCHAR(190) NOT NULL,
  role ENUM('admin', 'student', 'teacher', 'learn_manager') NOT NULL DEFAULT 'student',
  provider VARCHAR(40) NOT NULL DEFAULT 'password',
  google_sub VARCHAR(190) NULL UNIQUE,
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE content_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resource ENUM('pages', 'programs', 'projects', 'courses', 'media', 'careers') NOT NULL,
  slug VARCHAR(160) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'en',
  title VARCHAR(255) NOT NULL,
  summary TEXT NULL,
  body MEDIUMTEXT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
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

CREATE TABLE course_applications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NULL,
  student_user_id BIGINT UNSIGNED NULL,
  applicant_name VARCHAR(190) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(80) NULL,
  message TEXT NULL,
  status ENUM('submitted', 'reviewing', 'accepted', 'rejected') NOT NULL DEFAULT 'submitted',
  manager_notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_applications_status (status),
  INDEX idx_applications_email (email),
  CONSTRAINT fk_applications_course FOREIGN KEY (course_id) REFERENCES content_items(id) ON DELETE SET NULL,
  CONSTRAINT fk_applications_student FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
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
