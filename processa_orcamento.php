<?php
require_once "conexao.php";

// Impede acesso direto pela URL sem enviar o formulário
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contato.html');
    exit;
}

// 1. Recebe os dados enviados pelo formulário HTML
$nome     = trim($_POST['nome_cliente'] ?? '');
$email    = trim($_POST['email_cliente'] ?? '');
$telefone = trim($_POST['telefone_cliente'] ?? '');
$data     = trim($_POST['data_evento'] ?? '');
$slug     = trim($_POST['linha_produto'] ?? '');
$entrega  = trim($_POST['tipo_entrega'] ?? '');
$mensagem = trim($_POST['mensagem'] ?? '');
$lgpd     = isset($_POST['aceite_lgpd']) ? 1 : 0;

// Validação básica dos campos obrigatórios
if ($nome === '' || $email === '' || $telefone === '' || $data === '' || $slug === '' || $entrega === '' || $lgpd !== 1) {
    die("Por favor, preencha todos os campos obrigatórios e aceite os termos de privacidade.");
}

// 2. Processa o upload da foto de referência (opcional)
$caminhoFoto = null;

if (isset($_FILES['foto_referencia']) && $_FILES['foto_referencia']['error'] === UPLOAD_ERR_OK) {
    $pastaUploads = __DIR__ . '/uploads/';
    if (!is_dir($pastaUploads)) {
        mkdir($pastaUploads, 0755, true);
    }

    $extensao = strtolower(pathinfo($_FILES['foto_referencia']['name'], PATHINFO_EXTENSION));
    $permitidas = ['jpg', 'jpeg', 'png', 'webp'];

    if (in_array($extensao, $permitidas, true) && getimagesize($_FILES['foto_referencia']['tmp_name']) !== false) {
        $nomeArquivo = uniqid('ref_', true) . '.' . $extensao;
        if (move_uploaded_file($_FILES['foto_referencia']['tmp_name'], $pastaUploads . $nomeArquivo)) {
            $caminhoFoto = 'uploads/' . $nomeArquivo;
        }
    }
}

// 3. Busca o ID da linha comercial escolhida (casamentos, tematicos ou sobremesas)
$stmtLinha = $conn->prepare("SELECT id_linha FROM linhas_produtos WHERE slug_linha = ? LIMIT 1");
$stmtLinha->bind_param("s", $slug);
$stmtLinha->execute();
$resLinha = $stmtLinha->get_result();

if ($resLinha->num_rows === 0) {
    die("Linha de produto inválida.");
}
$idLinha = (int) $resLinha->fetch_assoc()['id_linha'];
$stmtLinha->close();

// 4. Salva ou atualiza o cliente na tabela 'clientes'
$stmtCliente = $conn->prepare("
    INSERT INTO clientes (nome_cliente, email_cliente, telefone_cliente, aceite_lgpd)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        id_cliente = LAST_INSERT_ID(id_cliente),
        nome_cliente = VALUES(nome_cliente),
        telefone_cliente = VALUES(telefone_cliente)
");
$stmtCliente->bind_param("sssi", $nome, $email, $telefone, $lgpd);
$stmtCliente->execute();
$idCliente = (int) $conn->insert_id;
$stmtCliente->close();

// 5. Registra o pedido na tabela 'orcamentos'
$stmtOrcamento = $conn->prepare("
    INSERT INTO orcamentos (id_cliente, id_linha, data_evento, tipo_entrega, caminho_foto_referencia, mensagem)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmtOrcamento->bind_param("iissss", $idCliente, $idLinha, $data, $entrega, $caminhoFoto, $mensagem);
$sucesso = $stmtOrcamento->execute();
$idOrcamento = (int) $conn->insert_id;
$stmtOrcamento->close();
$conn->close();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitação Enviada | Doce &amp; Sabor</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="container-center" style="padding: 90px 24px; text-align: center;">
        <div class="contact-form" style="max-width: 600px; margin: 0 auto;">
            <?php if ($sucesso): ?>
                <span class="section-tag">Orçamento #<?php echo $idOrcamento; ?> Registrado</span>
                <h1 class="section-title">Solicitação Recebida com Sucesso!</h1>
                <p class="contato-intro">
                    Obrigada, <strong><?php echo htmlspecialchars($nome, ENT_QUOTES, 'UTF-8'); ?></strong>! Recebemos os detalhes do seu evento para o dia <strong><?php echo date('d/m/Y', strtotime($data)); ?></strong> e entraremos em contato pelo WhatsApp <strong><?php echo htmlspecialchars($telefone, ENT_QUOTES, 'UTF-8'); ?></strong>.
                </p>
                <a href="index.html" class="btn-cta-primary">Voltar para a Página Inicial</a>
            <?php else: ?>
                <h1 class="section-title">Ops! Algo deu errado.</h1>
                <p class="contato-intro">Não foi possível registrar seu pedido agora. Tente novamente.</p>
                <a href="contato.html" class="btn-cta-secondary">Voltar ao Formulário</a>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>