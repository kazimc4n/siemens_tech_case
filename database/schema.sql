-- 8D Problem Solving Platform - Database Schema
-- Created: 2026-01-11

-- Problems table (D1-D2: Problem Definition)
CREATE TABLE IF NOT EXISTS problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsible_team VARCHAR(100) NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Root Cause Tree (D4: Root Cause Analysis)
-- This table uses Adjacency List Model for tree structure
CREATE TABLE IF NOT EXISTS root_causes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INT NOT NULL,
    parent_id INT NULL, -- NULL means root node, otherwise points to parent cause
    cause_text TEXT NOT NULL,
    is_root_cause BOOLEAN DEFAULT FALSE, -- Mark if this is identified as THE root cause
    action_plan TEXT NULL, -- D5: Corrective action if this is root cause
    level INT DEFAULT 0, -- Depth level in tree (0 = first level)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES root_causes(id) ON DELETE CASCADE,
    INDEX idx_problem_id (problem_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_root_cause (is_root_cause)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Audit log for tracking changes
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
