<?php
/**
 * Root Cause Model
 * Handles D4-D5: Root Cause Analysis and Solutions
 * Implements recursive tree data structure
 */
class RootCause {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get all root causes for a problem as a tree structure
     * This is the core method for handling recursive tree data
     */
    public function getTreeByProblemId($problemId) {
        // First, get all causes for this problem
        $stmt = $this->db->prepare(
            "SELECT * FROM root_causes 
             WHERE problem_id = :problem_id 
             ORDER BY level ASC, created_at ASC"
        );
        $stmt->execute([':problem_id' => $problemId]);
        $allCauses = $stmt->fetchAll();
        
        if (empty($allCauses)) {
            return [];
        }
        
        // Build tree structure recursively
        return $this->buildTree($allCauses);
    }
    
    /**
     * Build hierarchical tree from flat array
     * Uses Adjacency List Model pattern
     */
    private function buildTree($items, $parentId = null) {
        $branch = [];
        
        foreach ($items as $item) {
            // Match parent_id (null for root nodes)
            if ($item['parent_id'] == $parentId) {
                // Recursively get children
                $children = $this->buildTree($items, $item['id']);
                
                if ($children) {
                    $item['children'] = $children;
                } else {
                    $item['children'] = [];
                }
                
                // Convert numeric values
                $item['id'] = (int)$item['id'];
                $item['problem_id'] = (int)$item['problem_id'];
                $item['parent_id'] = $item['parent_id'] ? (int)$item['parent_id'] : null;
                $item['level'] = (int)$item['level'];
                $item['is_root_cause'] = (bool)$item['is_root_cause'];
                
                $branch[] = $item;
            }
        }
        
        return $branch;
    }
    
    /**
     * Get flat list of all causes for a problem
     */
    public function getAllByProblemId($problemId) {
        $stmt = $this->db->prepare(
            "SELECT * FROM root_causes 
             WHERE problem_id = :problem_id 
             ORDER BY level ASC, created_at ASC"
        );
        $stmt->execute([':problem_id' => $problemId]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Get single cause by ID
     */
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM root_causes WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        return $stmt->fetch();
    }
    
    /**
     * Create new root cause
     */
    public function create($data) {
        // Calculate level based on parent
        $level = 0;
        if (!empty($data['parent_id'])) {
            $parent = $this->getById($data['parent_id']);
            if ($parent) {
                $level = $parent['level'] + 1;
            }
        }
        
        $sql = "INSERT INTO root_causes 
                (problem_id, parent_id, cause_text, is_root_cause, action_plan, level) 
                VALUES (:problem_id, :parent_id, :cause_text, :is_root_cause, :action_plan, :level)";
        
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            ':problem_id' => $data['problem_id'],
            ':parent_id' => $data['parent_id'] ?? null,
            ':cause_text' => $data['cause_text'],
            ':is_root_cause' => isset($data['is_root_cause']) ? (int)(bool)$data['is_root_cause'] : 0,
            ':action_plan' => $data['action_plan'] ?? null,
            ':level' => $level
        ]);
        
        if ($result) {
            return $this->getById($this->db->lastInsertId());
        }
        
        return false;
    }
    
    /**
     * Update existing root cause
     */
    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        
        $allowedFields = ['cause_text', 'is_root_cause', 'action_plan'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }
        
        if (empty($fields)) {
            return false;
        }
        
        // If marking as root cause, unmark others in the same problem
        if (isset($data['is_root_cause']) && $data['is_root_cause']) {
            $cause = $this->getById($id);
            if ($cause) {
                $this->unmarkAllRootCauses($cause['problem_id']);
            }
        }
        
        $sql = "UPDATE root_causes SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute($params);
        
        if ($result) {
            return $this->getById($id);
        }
        
        return false;
    }
    
    /**
     * Unmark all root causes for a problem
     */
    private function unmarkAllRootCauses($problemId) {
        $sql = "UPDATE root_causes 
                SET is_root_cause = FALSE, action_plan = NULL 
                WHERE problem_id = :problem_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':problem_id' => $problemId]);
    }
    
    /**
     * Delete root cause and all its children (cascade)
     */
    public function delete($id) {
        // Foreign key cascade will handle children deletion
        $stmt = $this->db->prepare("DELETE FROM root_causes WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
    
    /**
     * Get the marked root cause for a problem (if any)
     */
    public function getRootCauseByProblemId($problemId) {
        $stmt = $this->db->prepare(
            "SELECT * FROM root_causes 
             WHERE problem_id = :problem_id AND is_root_cause = TRUE 
             LIMIT 1"
        );
        $stmt->execute([':problem_id' => $problemId]);
        
        return $stmt->fetch();
    }
    
    /**
     * Get depth of tree for a problem (max level)
     */
    public function getMaxDepth($problemId) {
        $stmt = $this->db->prepare(
            "SELECT MAX(level) as max_depth 
             FROM root_causes 
             WHERE problem_id = :problem_id"
        );
        $stmt->execute([':problem_id' => $problemId]);
        $result = $stmt->fetch();
        
        return $result ? (int)$result['max_depth'] : 0;
    }
}
