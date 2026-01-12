<?php
/**
 * Root Causes Controller
 * Handles HTTP requests for Root Cause Analysis (tree structure)
 */
class RootCausesController {
    private $model;
    private $problemModel;
    
    public function __construct() {
        $this->model = new RootCause();
        $this->problemModel = new Problem();
    }
    
    /**
     * GET /problems/:problemId/root-causes
     * Get root cause tree for a problem
     */
    public function index($problemId) {
        try {
            // Verify problem exists
            $problem = $this->problemModel->getById($problemId);
            if (!$problem) {
                Response::notFound('Problem not found');
            }
            
            // Get tree structure
            $tree = $this->model->getTreeByProblemId($problemId);
            
            // Get additional info
            $rootCause = $this->model->getRootCauseByProblemId($problemId);
            $maxDepth = $this->model->getMaxDepth($problemId);
            
            Response::success([
                'problem_id' => (int)$problemId,
                'tree' => $tree,
                'root_cause' => $rootCause,
                'max_depth' => $maxDepth,
                'total_causes' => count($this->model->getAllByProblemId($problemId))
            ]);
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * GET /root-causes/:id
     * Get single root cause
     */
    public function show($id) {
        try {
            $cause = $this->model->getById($id);
            
            if (!$cause) {
                Response::notFound('Root cause not found');
            }
            
            Response::success($cause);
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * POST /root-causes
     * Create new root cause
     */
    public function store() {
        try {
            $data = $this->getJsonInput();
            
            // Validation
            $errors = $this->validateRootCauseData($data);
            if (!empty($errors)) {
                Response::error('Validation failed', 422, $errors);
            }
            
            // Verify problem exists
            $problem = $this->problemModel->getById($data['problem_id']);
            if (!$problem) {
                Response::error('Problem not found', 404);
            }
            
            // Verify parent exists if provided
            if (!empty($data['parent_id'])) {
                $parent = $this->model->getById($data['parent_id']);
                if (!$parent) {
                    Response::error('Parent cause not found', 404);
                }
                
                // Verify parent belongs to same problem
                if ($parent['problem_id'] != $data['problem_id']) {
                    Response::error('Parent cause must belong to the same problem', 400);
                }
            }
            
            $cause = $this->model->create($data);
            
            if ($cause) {
                Response::created($cause, 'Root cause created successfully');
            } else {
                Response::serverError('Failed to create root cause');
            }
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * PUT /root-causes/:id
     * Update existing root cause
     */
    public function update($id) {
        try {
            $data = $this->getJsonInput();
            
            // Check if cause exists
            $existing = $this->model->getById($id);
            if (!$existing) {
                Response::notFound('Root cause not found');
            }
            
            // Validation (partial for updates)
            $errors = $this->validateRootCauseData($data, false);
            if (!empty($errors)) {
                Response::error('Validation failed', 422, $errors);
            }
            
            $cause = $this->model->update($id, $data);
            
            if ($cause) {
                Response::success($cause, 'Root cause updated successfully');
            } else {
                Response::serverError('Failed to update root cause');
            }
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * DELETE /root-causes/:id
     * Delete root cause (will cascade to children)
     */
    public function destroy($id) {
        try {
            // Check if cause exists
            $existing = $this->model->getById($id);
            if (!$existing) {
                Response::notFound('Root cause not found');
            }
            
            $result = $this->model->delete($id);
            
            if ($result) {
                Response::success(null, 'Root cause deleted successfully (including children)');
            } else {
                Response::serverError('Failed to delete root cause');
            }
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * Validate root cause data
     */
    private function validateRootCauseData($data, $required = true) {
        $errors = [];
        
        if ($required) {
            if (empty($data['problem_id'])) {
                $errors['problem_id'] = 'Problem ID is required';
            }
            
            if (empty($data['cause_text'])) {
                $errors['cause_text'] = 'Cause text is required';
            }
        }
        
        if (isset($data['problem_id']) && !is_numeric($data['problem_id'])) {
            $errors['problem_id'] = 'Problem ID must be numeric';
        }
        
        if (isset($data['parent_id']) && !empty($data['parent_id']) && !is_numeric($data['parent_id'])) {
            $errors['parent_id'] = 'Parent ID must be numeric';
        }
        
        if (isset($data['is_root_cause']) && !is_bool($data['is_root_cause'])) {
            $errors['is_root_cause'] = 'is_root_cause must be boolean';
        }
        
        // If marking as root cause, action plan should be provided
        if (isset($data['is_root_cause']) && $data['is_root_cause'] === true) {
            if (empty($data['action_plan'])) {
                $errors['action_plan'] = 'Action plan is required when marking as root cause';
            }
        }
        
        return $errors;
    }
    
    /**
     * Get JSON input from request body
     */
    private function getJsonInput() {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            Response::error('Invalid JSON input', 400);
        }
        
        return $data ?? [];
    }
}
