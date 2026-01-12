<?php
/**
 * Problem Model
 * Handles D1-D2: Problem Definition
 */
class Problem {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get all problems with optional filtering
     */
    public function getAll($filters = []) {
        $sql = "SELECT * FROM problems WHERE 1=1";
        $params = [];
        
        if (isset($filters['status'])) {
            $sql .= " AND status = :status";
            $params[':status'] = $filters['status'];
        }
        
        if (isset($filters['team'])) {
            $sql .= " AND responsible_team = :team";
            $params[':team'] = $filters['team'];
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Get single problem by ID
     */
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM problems WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        return $stmt->fetch();
    }
    
    /**
     * Create new problem
     */
    public function create($data) {
        $sql = "INSERT INTO problems (title, description, responsible_team, status) 
                VALUES (:title, :description, :responsible_team, :status)";
        
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':responsible_team' => $data['responsible_team'],
            ':status' => $data['status'] ?? 'open'
        ]);
        
        if ($result) {
            return $this->getById($this->db->lastInsertId());
        }
        
        return false;
    }
    
    /**
     * Update existing problem
     */
    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        
        $allowedFields = ['title', 'description', 'responsible_team', 'status'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }
        
        if (empty($fields)) {
            return false;
        }
        
        $sql = "UPDATE problems SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute($params);
        
        if ($result) {
            return $this->getById($id);
        }
        
        return false;
    }
    
    /**
     * Delete problem
     */
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM problems WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
    
    /**
     * Get problem statistics
     */
    public function getStatistics() {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count
                FROM problems";
        
        $stmt = $this->db->query($sql);
        return $stmt->fetch();
    }
}
