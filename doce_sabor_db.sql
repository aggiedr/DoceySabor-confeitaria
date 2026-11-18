-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 18/11/2026 às 17:39
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `doce_sabor_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nome_cliente` varchar(100) NOT NULL,
  `email_cliente` varchar(120) NOT NULL,
  `telefone_cliente` varchar(15) NOT NULL,
  `aceite_lgpd` tinyint(1) NOT NULL DEFAULT 1,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nome_cliente`, `email_cliente`, `telefone_cliente`, `aceite_lgpd`, `data_cadastro`) VALUES
(1, 'ÁGATA DIAS RIBEIRO', 'agata.ribeiro@edu.senai.br', '(19) 98327-3362', 1, '2026-11-18 13:24:30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_orcamento`
--

CREATE TABLE `itens_orcamento` (
  `id_item` int(11) NOT NULL,
  `id_orcamento` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `valor_unitario_negociado` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `linhas_produtos`
--

CREATE TABLE `linhas_produtos` (
  `id_linha` int(11) NOT NULL,
  `slug_linha` varchar(30) NOT NULL,
  `nome_linha` varchar(80) NOT NULL,
  `pedido_minimo` int(11) NOT NULL,
  `antecedencia_minima` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `linhas_produtos`
--

INSERT INTO `linhas_produtos` (`id_linha`, `slug_linha`, `nome_linha`, `pedido_minimo`, `antecedencia_minima`) VALUES
(1, 'casamentos', 'Doces Finos & Casamentos', 50, '15 dias'),
(2, 'tematicos', 'Doces Personalizados Temáticos', 20, '10 dias'),
(3, 'sobremesas', 'Sobremesas & Pronta Entrega', 15, '48 horas');

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamentos`
--

CREATE TABLE `orcamentos` (
  `id_orcamento` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_linha` int(11) NOT NULL,
  `data_evento` date NOT NULL,
  `tipo_entrega` enum('retirada','entrega') NOT NULL,
  `caminho_foto_referencia` varchar(255) DEFAULT NULL,
  `mensagem` varchar(1000) DEFAULT NULL,
  `status_orcamento` enum('pendente','em_analise','aprovado','recusado') NOT NULL DEFAULT 'pendente',
  `data_solicitacao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `orcamentos`
--

INSERT INTO `orcamentos` (`id_orcamento`, `id_cliente`, `id_linha`, `data_evento`, `tipo_entrega`, `caminho_foto_referencia`, `mensagem`, `status_orcamento`, `data_solicitacao`) VALUES
(1, 1, 1, '2027-08-20', 'retirada', NULL, '', 'pendente', '2026-11-18 13:24:30'),
(2, 1, 1, '2028-08-20', 'entrega', 'uploads/ref_6afdd2ed65d728.96410862.jpg', '600 doces tradicionais.', 'pendente', '2026-11-18 13:31:41');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

CREATE TABLE `produtos` (
  `id_produto` int(11) NOT NULL,
  `id_linha` int(11) NOT NULL,
  `nome_produto` varchar(120) NOT NULL,
  `descricao` text DEFAULT NULL,
  `valor_unitario` decimal(8,2) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id_produto`, `id_linha`, `nome_produto`, `descricao`, `valor_unitario`, `ativo`) VALUES
(1, 1, 'Copinho de Chocolate Belga com Cereja', 'Casquinha de chocolate nobre recheada com ganache suave e cereja fresca.', 4.80, 1),
(2, 1, 'Quadrado de Leite Ninho com Flor', 'Doce fino aveludado finalizado com delicada flor de açúcar.', 4.50, 1),
(3, 1, 'Camafeu de Nozes Caramelizadas', 'Receita artesanal tradicional com cobertura cristalizada e toque dourado.', 5.20, 1),
(4, 1, 'Trufa Dourada de Pistache', 'Recheio cremoso de pistache selecionado com acabamento sofisticado.', 5.20, 1),
(5, 2, 'Pirulitos de Chocolate Modelados à Mão', 'Decorados artesanalmente conforme as cores e personagens do evento.', 8.90, 1),
(6, 2, 'Pães de Mel Decorados em Pasta Americana', 'Massa especiada com recheio cremoso e modelagem personalizada.', 8.90, 1),
(7, 3, 'Caminha Crocante com Doce de Leite', 'Base crocante com recheio aveludado de doce de leite cozido.', 6.50, 1),
(8, 3, 'Brownie Recheado de Ganache Meio Amargo', 'Massa úmida de chocolate nobre com camada generosa de ganache.', 6.50, 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `email_cliente` (`email_cliente`);

--
-- Índices de tabela `itens_orcamento`
--
ALTER TABLE `itens_orcamento`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `fk_item_orcamento` (`id_orcamento`),
  ADD KEY `fk_item_produto` (`id_produto`);

--
-- Índices de tabela `linhas_produtos`
--
ALTER TABLE `linhas_produtos`
  ADD PRIMARY KEY (`id_linha`),
  ADD UNIQUE KEY `slug_linha` (`slug_linha`);

--
-- Índices de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  ADD PRIMARY KEY (`id_orcamento`),
  ADD KEY `fk_orcamento_cliente` (`id_cliente`),
  ADD KEY `fk_orcamento_linha` (`id_linha`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `fk_produto_linha` (`id_linha`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `itens_orcamento`
--
ALTER TABLE `itens_orcamento`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `linhas_produtos`
--
ALTER TABLE `linhas_produtos`
  MODIFY `id_linha` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  MODIFY `id_orcamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `itens_orcamento`
--
ALTER TABLE `itens_orcamento`
  ADD CONSTRAINT `fk_item_orcamento` FOREIGN KEY (`id_orcamento`) REFERENCES `orcamentos` (`id_orcamento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_item_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `orcamentos`
--
ALTER TABLE `orcamentos`
  ADD CONSTRAINT `fk_orcamento_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orcamento_linha` FOREIGN KEY (`id_linha`) REFERENCES `linhas_produtos` (`id_linha`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `produtos`
--
ALTER TABLE `produtos`
  ADD CONSTRAINT `fk_produto_linha` FOREIGN KEY (`id_linha`) REFERENCES `linhas_produtos` (`id_linha`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
