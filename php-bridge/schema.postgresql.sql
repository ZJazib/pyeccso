CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(190) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student', 'teacher', 'learn_manager')),
  provider VARCHAR(40) NOT NULL DEFAULT 'password',
  google_sub VARCHAR(190) UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE content_items (
  id BIGSERIAL PRIMARY KEY,
  resource VARCHAR(30) NOT NULL CHECK (resource IN ('pages', 'programs', 'projects', 'courses', 'media', 'careers')),
  slug VARCHAR(160) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'en',
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  body TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  metadata_json JSONB,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource, slug, language)
);

CREATE INDEX idx_content_resource_language_status ON content_items(resource, language, status);

CREATE TABLE course_applications (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES content_items(id) ON DELETE SET NULL,
  student_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  applicant_name VARCHAR(190) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(80),
  message TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'accepted', 'rejected')),
  manager_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_status ON course_applications(status);
CREATE INDEX idx_applications_email ON course_applications(email);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(120) NOT NULL,
  target_type VARCHAR(80),
  target_id BIGINT,
  ip_address VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user_created ON audit_logs(user_id, created_at);

CREATE TABLE course_materials (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  original_name VARCHAR(255) NOT NULL,
  storage_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(160) NOT NULL,
  size_bytes BIGINT NOT NULL,
  visibility VARCHAR(20) NOT NULL DEFAULT 'enrolled' CHECK (visibility IN ('enrolled', 'public')),
  uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_materials_course ON course_materials(course_id);
