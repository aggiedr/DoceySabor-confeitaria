<?php
$servidor = "127.0.0.1";
$usuario  = "root";
$senha    = "";
$banco    = "doce_sabor_db";

$conn = new mysqli($servidor, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>