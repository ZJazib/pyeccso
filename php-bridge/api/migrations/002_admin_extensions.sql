-- PYECSO Admin extensions: donations, users management, site settings, media
-- Run once against the production database:
--   mysql -u USER -p DB_NAME < php-bridge/api/migrations/002_admin_extensions.sql

-- Donation campaigns (per-language rows, similar to content_items pattern)
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

-- Donations ledger (HesabPay sessions + manual entries)
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

-- Uploaded media library
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

-- Editable site settings (key/value JSON)
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) NOT NULL,
  value_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed baseline settings (safe to re-run)
INSERT IGNORE INTO site_settings (setting_key, value_json) VALUES
  ('contact', '{"email":"info@pyecso.org.af","phone":"+93 700 000 000","address":"Kabul, Afghanistan"}'),
  ('social', '{"facebook":"","x":"","linkedin":"","youtube":"","instagram":""}'),
  ('donation', '{"hesabpay_merchant_id":"","bank_name":"","bank_account_number":"","bank_account_name":"","iban":"","swift":""}'),
  ('map', '{"embed_url":"https://www.google.com/maps?output=embed&q=Kabul%2C%20Afghanistan"}');
