<?php
/**
 * Database Connection Handler
 * Singleton pattern for PDO connection management
 */
class Database {
    private static $instance = null;
    private $connection;
    private $config;
    
    private function __construct() {
        $configPath = __DIR__ . '/../database/config.php';
        if (!file_exists($configPath)) {
            throw new Exception('Database config file not found. Copy config.example.php to config.php');
        }
        
        $this->config = require $configPath;
        $this->connect();
    }
    
    private function connect() {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                $this->config['host'],
                $this->config['port'],
                $this->config['database'],
                $this->config['charset']
            );
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->connection = new PDO(
                $dsn,
                $this->config['username'],
                $this->config['password'],
                $options
            );
            
            // Set timezone
            if (isset($this->config['timezone'])) {
                date_default_timezone_set($this->config['timezone']);
            }
            
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function getConfig($key = null) {
        if ($key === null) {
            return $this->config;
        }
        return $this->config[$key] ?? null;
    }
    
    // Prevent cloning
    private function __clone() {}
    
    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}
