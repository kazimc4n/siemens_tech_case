<?php
/**
 * API Entry Point
 * 8D Problem Solving Platform - RESTful API
 */

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
$config = require __DIR__ . '/../database/config.php';
$allowedOrigins = $config['cors_origins'] ?? ['*'];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Autoload classes
spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
    ];
    
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

// Initialize router
$router = new Router();

// Health check endpoint
// Health check endpoint
$router->get('/health', function() {
    try {
        // Attempt database connection to verify readiness
        Database::getInstance()->getConnection();
        
        Response::success([
            'status' => 'healthy',
            'database' => 'connected',
            'timestamp' => date('c'),
            'version' => '1.0.0'
        ]);
    } catch (Exception $e) {
        Response::error('Service Unavailable', 503, [
            'detail' => $e->getMessage()
        ]);
    }
});

// ===== Problem Routes =====
$problemsController = new ProblemsController();

$router->get('/problems', [$problemsController, 'index']);
$router->get('/problems/statistics', [$problemsController, 'statistics']);
$router->get('/problems/:id', [$problemsController, 'show']);
$router->post('/problems', [$problemsController, 'store']);
$router->put('/problems/:id', [$problemsController, 'update']);
$router->delete('/problems/:id', [$problemsController, 'destroy']);

// ===== Root Cause Routes =====
$rootCausesController = new RootCausesController();

$router->get('/problems/:problemId/root-causes', [$rootCausesController, 'index']);
$router->get('/root-causes/:id', [$rootCausesController, 'show']);
$router->post('/root-causes', [$rootCausesController, 'store']);
$router->put('/root-causes/:id', [$rootCausesController, 'update']);
$router->delete('/root-causes/:id', [$rootCausesController, 'destroy']);

// Set 404 handler
$router->setNotFoundHandler(function() {
    Response::notFound('API endpoint not found');
});

// Run the router
try {
    $router->run();
} catch (Exception $e) {
    if ($config['debug_mode'] ?? false) {
        Response::serverError($e->getMessage());
    } else {
        Response::serverError('An unexpected error occurred');
    }
}
