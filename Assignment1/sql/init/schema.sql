SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

DROP TABLE IF EXISTS dialect_regions;
DROP TABLE IF EXISTS country_languages;
DROP TABLE IF EXISTS dialects;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS special_regions;

-- countries
CREATE TABLE countries (
  iso2 CHAR(5) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  PRIMARY KEY (iso2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- regions
CREATE TABLE regions (
  iso_3166_2 CHAR(5) NOT NULL,
  province_en VARCHAR(100) NOT NULL,
  PRIMARY KEY (iso_3166_2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- languages
CREATE TABLE languages (
  lang_code CHAR(3) NOT NULL, 
  name_en VARCHAR(100) NOT NULL,
  PRIMARY KEY (lang_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- dialects
CREATE TABLE dialects (
  dialect_code VARCHAR(100) NOT NULL,
  dialect_en   VARCHAR(100) NOT NULL,
  language_code CHAR(3) NOT NULL,
  notes TEXT NOT NULL,
  PRIMARY KEY (dialect_code),
  CONSTRAINT fk_dialect_lang
    FOREIGN KEY (language_code) REFERENCES languages(lang_code)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- country_languages
CREATE TABLE country_languages (
  iso2 CHAR(5) NOT NULL,
  lang_code CHAR(3) NOT NULL,
  status ENUM('official','regional','widely_spoken','minority') NOT NULL,
  greet TEXT NULL,
  PRIMARY KEY (iso2, lang_code)
  CONSTRAINT fk_cl_country
    FOREIGN KEY (iso2) REFERENCES countries(iso2)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cl_lang
    FOREIGN KEY (lang_code) REFERENCES languages(lang_code)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- dialect_regions
CREATE TABLE dialect_regions (
  dialect_code VARCHAR(100) NOT NULL,
  region_code  CHAR(5) NOT NULL,
  coverage ENUM('full','partial','urban') NULL,
  PRIMARY KEY (dialect_code, region_code),
  CONSTRAINT fk_dr_dialect
    FOREIGN KEY (dialect_code) REFERENCES dialects(dialect_code)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_dr_region
    FOREIGN KEY (region_code) REFERENCES regions(iso_3166_2)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- special_regions
CREATE TABLE special_regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NULL,
    name_en VARCHAR(150) NOT NULL,
    region_type VARCHAR(100) NULL,
    parent_iso2 CHAR(5) NULL,
    CONSTRAINT fk_sr_parent
      FOREIGN KEY (parent_iso2) REFERENCES countries(iso2)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;