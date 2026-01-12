<?php
/**
 * Problems Controller
 * Handles HTTP requests for Problem resources
 */
class ProblemsController {
    private $model;
    
    public function __construct() {
        $this->model = new Problem();
    }
    
    /**
     * GET /problems
     * List all problems
     */
    public function index() {
        try {
            $filters = [];
            
            if (isset($_GET['status'])) {
                $filters['status'] = $_GET['status'];
            }
            
            if (isset($_GET['team'])) {
                $filters['team'] = $_GET['team'];
            }
            
            $problems = $this->model->getAll($filters);
            
            Response::success([
                'problems' => $problems,
                'count' => count($problems)
            ]);
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * GET /problems/:id
     * Get single problem
     */
    public function show($id) {
        try {
            $problem = $this->model->getById($id);
            
            if (!$problem) {
                Response::notFound('Problem not found');
            }
            
            Response::success($problem);
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * POST /problems
     * Create new problem
     */
    public function store() {
        try {
            $data = $this->getJsonInput();
            
            // Validation
            $errors = $this->validateProblemData($data);
            if (!empty($errors)) {
                Response::error('Validation failed', 422, $errors);
            }
            
            $problem = $this->model->create($data);
            
            if ($problem) {
                Response::created($problem, 'Problem created successfully');
            } else {
                Response::serverError('Failed to create problem');
            }
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * PUT /problems/:id
     * Update existing problem
     */
    public function update($id) {
        try {
            $data = $this->getJsonInput();
            
            // Check if problem exists
            $existing = $this->model->getById($id);
            if (!$existing) {
                Response::notFound('Problem not found');
            }
            
            // Validation (partial for updates)
            $errors = $this->validateProblemData($data, false);
            if (!empty($errors)) {
                Response::error('Validation failed', 422, $errors);
            }
            
            $problem = $this->model->update($id, $data);
            
            if ($problem) {
                Response::success($problem, 'Problem updated successfully');
            } else {
                Response::serverError('Failed to update problem');
            }
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * DELETE /problems/:id
     * Delete problem
     */
    public function destroy($id) {
        try {
            // Check if problem exists
            $existing = $this->model->getById($id);
            if (!$existing) {
                Response::notFound('Problem not found');
            }
            
            $result = $this->model->delete($id);
            
            if ($result) {
                Response::success(null, 'Problem deleted successfully');
            } else {
                Response::serverError('Failed to delete problem');
            }
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * GET /problems/statistics
     * Get problem statistics
     */
    public function statistics() {
        try {
            $stats = $this->model->getStatistics();
            Response::success($stats);
            
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    /**
     * Validate problem data
     */
    private function validateProblemData($data, $required = true) {
        $errors = [];
        
        if ($required) {
            if (empty($data['title'])) {
                $errors['title'] = 'Title is required';
            }
            
            if (empty($data['description'])) {
                $errors['description'] = 'Description is required';
            }
            
            if (empty($data['responsible_team'])) {
                $errors['responsible_team'] = 'Responsible team is required';
            }
        }
        
        if (isset($data['title']) && strlen($data['title']) > 255) {
            $errors['title'] = 'Title must not exceed 255 characters';
        }
        
        if (isset($data['status']) && !in_array($data['status'], ['open', 'closed'])) {
            $errors['status'] = 'Status must be either "open" or "closed"';
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
