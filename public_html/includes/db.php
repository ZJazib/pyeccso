<?php
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $cfg = $GLOBALS['CONFIG']['db'];
    $dsn = "mysql:host={$cfg['host']};port={$cfg['port']};dbname={$cfg['database']};charset={$cfg['charset']}";
    $pdo = new PDO($dsn, $cfg['username'], $cfg['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function q(string $sql, array $params = []): PDOStatement {
    $s = db()->prepare($sql);
    $s->execute($params);
    return $s;
}

function q_one(string $sql, array $params = []): ?array {
    $r = q($sql, $params)->fetch();
    return $r ?: null;
}

function q_all(string $sql, array $params = []): array {
    return q($sql, $params)->fetchAll();
}
