-- Sample data for testing

-- Insert sample problems
INSERT INTO problems (title, description, responsible_team, status) VALUES
('Machine A1 Unexpected Shutdown', 'Production line Machine A1 stopped unexpectedly causing 2 hours of downtime', 'Maintenance Team', 'open'),
('Product Quality Deviation - Lot #4521', 'Dimensional tolerance exceeded in products manufactured in Lot 4521', 'Quality Control', 'open'),
('Raw Material Supply Delay', 'Raw material from supplier XYZ was delayed by 3 days', 'Purchasing', 'closed');

-- Insert sample root causes for Problem #1 (5 Why Analysis)
-- Level 1: Why did the machine stop?
INSERT INTO root_causes (problem_id, parent_id, cause_text, level) VALUES
(1, NULL, 'Electrical fuse blew', 0);

-- Level 2: Why did the fuse blow?
INSERT INTO root_causes (problem_id, parent_id, cause_text, level) VALUES
(1, 1, 'Motor overloaded', 1);

-- Level 3: Why was the motor overloaded?
INSERT INTO root_causes (problem_id, parent_id, cause_text, level) VALUES
(1, 2, 'Bearing overheated', 2);

-- Level 4: Why did the bearing overheat?
INSERT INTO root_causes (problem_id, parent_id, cause_text, level) VALUES
(1, 3, 'Insufficient lubrication', 3);

-- Level 5: Why was lubrication insufficient? (ROOT CAUSE)
INSERT INTO root_causes (problem_id, parent_id, cause_text, is_root_cause, action_plan, level) VALUES
(1, 4, 'Maintenance schedule not followed', TRUE, 'Implement automated maintenance tracking system and establish weekly lubrication control procedure', 4);

-- Alternative branch for Problem #1
INSERT INTO root_causes (problem_id, parent_id, cause_text, level) VALUES
(1, 1, 'Sudden power fluctuation in electrical network', 1),
(1, 6, 'Voltage regulator faulty', 2);

-- Sample root causes for Problem #2
INSERT INTO root_causes (problem_id, parent_id, cause_text, level) VALUES
(2, NULL, 'Measuring device calibration incorrect', 0),
(2, 8, 'No calibration performed in last 6 months', 1);
