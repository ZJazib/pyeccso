<?php
function db(): ?PDO {
    static $pdo = null;
    static $tried = false;
    if ($pdo) return $pdo;
    if ($tried) return null;
    $tried = true;
    $cfg = $GLOBALS['CONFIG']['db'];
    $dsn = "mysql:host={$cfg['host']};port={$cfg['port']};dbname={$cfg['database']};charset={$cfg['charset']}";
    try {
        $pdo = new PDO($dsn, $cfg['username'], $cfg['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $e) {
        $pdo = null;
    }
    return $pdo;
}

function q(string $sql, array $params = []): ?PDOStatement {
    $d = db();
    if (!$d) return null;
    try {
        $s = $d->prepare($sql);
        $s->execute($params);
        return $s;
    } catch (Throwable $e) { return null; }
}

function q_one(string $sql, array $params = []): ?array {
    $s = q($sql, $params);
    if (!$s) return null;
    $r = $s->fetch();
    return $r ?: null;
}

function q_all(string $sql, array $params = []): array {
    $s = q($sql, $params);
    return $s ? $s->fetchAll() : [];
}
