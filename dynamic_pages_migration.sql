-- Migration for Dynamic Pages System

CREATE TABLE IF NOT EXISTS dynamic_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    meta_desc TEXT,
    hero_subtitle VARCHAR(255),
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    section_type ENUM('richtext', 'table', 'filelist', 'cards', 'accordion', 'image_text') NOT NULL,
    title VARCHAR(255),
    content JSON NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES dynamic_pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nav_additions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nav_parent VARCHAR(100) NOT NULL,
    group_heading VARCHAR(100) NOT NULL,
    item_label VARCHAR(100) NOT NULL,
    page_slug VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 99,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
