-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           8.4.3 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para hotel
CREATE DATABASE IF NOT EXISTS `hotel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel`;

-- Copiando estrutura para tabela hotel.acompanhante
CREATE TABLE IF NOT EXISTS `acompanhante` (
  `acompanhante_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `acompanhante_nome` varchar(255) NOT NULL,
  `acompanhante_cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_rg` varchar(20) DEFAULT NULL,
  `acompanhante_data_nascimento` date NOT NULL,
  `acompanhante_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `acompanhante_parentesco` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_endereco` varchar(255) DEFAULT NULL,
  `acompanhante_cidade` varchar(100) DEFAULT NULL,
  `acompanhante_estado` varchar(50) DEFAULT NULL,
  `paciente_email` varchar(255) NOT NULL,
  `acompanhante_observacoes` text,
  PRIMARY KEY (`acompanhante_id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `acompanhante_id` (`acompanhante_id`),
  UNIQUE KEY `acompanhante_cpf` (`acompanhante_cpf`),
  KEY `idx_paciente_email` (`paciente_email`),
  CONSTRAINT `fk_acompanhante_paciente` FOREIGN KEY (`paciente_email`) REFERENCES `paciente` (`paciente_email`),
  CONSTRAINT `fk_acompanhante_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.acompanhante: ~1 rows (aproximadamente)
DELETE FROM `acompanhante`;
INSERT INTO `acompanhante` (`acompanhante_id`, `usuario_id`, `acompanhante_nome`, `acompanhante_cpf`, `acompanhante_rg`, `acompanhante_data_nascimento`, `acompanhante_sexo`, `acompanhante_parentesco`, `acompanhante_telefone`, `acompanhante_endereco`, `acompanhante_cidade`, `acompanhante_estado`, `paciente_email`, `acompanhante_observacoes`) VALUES
	(1, 28, 'acompanhante', '12345678900', '1234567890', '2020-02-02', NULL, 'mãe', '11963852741', 'avenida um', 'são paulo', 'SP', 'paciente@gmail.com', 'nenhuma');

-- Copiando estrutura para tabela hotel.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `admin_nome` varchar(255) NOT NULL,
  `admin_cpf` varchar(14) DEFAULT NULL,
  `admin_rg` varchar(20) DEFAULT NULL,
  `admin_data_nascimento` date DEFAULT NULL,
  `admin_idade` int DEFAULT NULL,
  `admin_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `admin_estado_civil` enum('Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','Outro') DEFAULT NULL,
  `admin_telefone` varchar(20) DEFAULT NULL,
  `admin_celular` varchar(20) DEFAULT NULL,
  `admin_email_alternativo` varchar(255) DEFAULT NULL,
  `admin_endereco` varchar(255) DEFAULT NULL,
  `admin_numero` varchar(10) DEFAULT NULL,
  `admin_bairro` varchar(100) DEFAULT NULL,
  `admin_cidade` varchar(100) DEFAULT NULL,
  `admin_estado` varchar(50) DEFAULT NULL,
  `admin_cep` varchar(10) DEFAULT NULL,
  `admin_cargo` varchar(100) NOT NULL,
  `admin_nivel_acesso` enum('Super Admin','Admin','Moderador','Suporte') DEFAULT 'Admin',
  `admin_permissoes` text COMMENT 'Lista de permissões específicas, em JSON ou CSV',
  `admin_data_inicio` date DEFAULT NULL,
  `admin_data_saida` date DEFAULT NULL,
  `admin_status` enum('ativo','inativo','suspenso') DEFAULT 'ativo',
  `admin_data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `admin_data_ultima_alteracao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `admin_ultimo_login` datetime DEFAULT NULL,
  `admin_ip_ultimo_login` varchar(45) DEFAULT NULL,
  `admin_tentativas_login` int DEFAULT '0',
  `admin_bloqueado` tinyint(1) DEFAULT '0',
  `admin_documento_identidade` varchar(255) DEFAULT NULL,
  `admin_documento_comprovante_residencia` varchar(255) DEFAULT NULL,
  `admin_observacoes` text,
  `admin_observacoes_internas` text,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `admin_id` (`admin_id`),
  UNIQUE KEY `admin_cpf` (`admin_cpf`),
  CONSTRAINT `fk_admin_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.admin: ~0 rows (aproximadamente)
DELETE FROM `admin`;
INSERT INTO `admin` (`admin_id`, `usuario_id`, `admin_nome`, `admin_cpf`, `admin_rg`, `admin_data_nascimento`, `admin_idade`, `admin_sexo`, `admin_estado_civil`, `admin_telefone`, `admin_celular`, `admin_email_alternativo`, `admin_endereco`, `admin_numero`, `admin_bairro`, `admin_cidade`, `admin_estado`, `admin_cep`, `admin_cargo`, `admin_nivel_acesso`, `admin_permissoes`, `admin_data_inicio`, `admin_data_saida`, `admin_status`, `admin_data_cadastro`, `admin_data_ultima_alteracao`, `admin_ultimo_login`, `admin_ip_ultimo_login`, `admin_tentativas_login`, `admin_bloqueado`, `admin_documento_identidade`, `admin_documento_comprovante_residencia`, `admin_observacoes`, `admin_observacoes_internas`) VALUES
	(3, 26, 'admin', '12345678900', '123456789', '2000-01-01', NULL, 'Feminino', 'Solteiro(a)', '11963852741', '11963852741', 'admin2@gamil.com', 'Avenida Dois', '123', 'Portal', 'Cajamar', 'SP', '07798652', 'administrador', 'Admin', NULL, '2025-10-23', '2030-10-23', 'ativo', '2025-10-24 01:07:07', '2025-10-24 01:07:07', NULL, NULL, 0, 0, NULL, NULL, 'nenhuma', 'nenhuma');

-- Copiando estrutura para tabela hotel.artigo
CREATE TABLE IF NOT EXISTS `artigo` (
  `artigo_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `artigo_titulo` varchar(255) NOT NULL,
  `artigo_subtitulo` varchar(255) DEFAULT NULL,
  `artigo_resumo` text COMMENT 'Breve resumo exibido nas listagens',
  `artigo_conteudo` longtext NOT NULL COMMENT 'Conteúdo completo do artigo (HTML ou Markdown)',
  `artigo_imagem_capa` varchar(255) DEFAULT NULL COMMENT 'Imagem principal de capa',
  `artigo_imagens_extras` text COMMENT 'Lista JSON de imagens adicionais dentro do conteúdo',
  `artigo_slug` varchar(255) DEFAULT NULL COMMENT 'URL amigável',
  `artigo_palavras_chave` varchar(255) DEFAULT NULL COMMENT 'Palavras-chave para SEO',
  `artigo_descricao_meta` varchar(255) DEFAULT NULL COMMENT 'Meta descrição para SEO',
  `artigo_categoria` varchar(100) DEFAULT NULL COMMENT 'Categoria do artigo (ex: prevenção, diagnóstico, tratamento)',
  `artigo_tags` varchar(255) DEFAULT NULL COMMENT 'Tags separadas por vírgula',
  `artigo_status` enum('rascunho','publicado','arquivado') DEFAULT 'rascunho',
  `artigo_data_publicacao` datetime DEFAULT NULL,
  `artigo_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `artigo_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `artigo_visualizacoes` int DEFAULT '0',
  `artigo_curtidas` int DEFAULT '0',
  `artigo_comentarios` int DEFAULT '0',
  `artigo_destacado` tinyint(1) DEFAULT '0' COMMENT 'Destaque na página principal ou FAQ',
  `artigo_aprovado_admin` tinyint(1) DEFAULT '0' COMMENT 'Se foi revisado e aprovado por um admin superior',
  `artigo_observacoes_internas` text,
  PRIMARY KEY (`artigo_id`),
  UNIQUE KEY `artigo_slug` (`artigo_slug`),
  KEY `fk_artigo_admin` (`admin_id`),
  CONSTRAINT `fk_artigo_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.artigo: ~1 rows (aproximadamente)
DELETE FROM `artigo`;
INSERT INTO `artigo` (`artigo_id`, `admin_id`, `artigo_titulo`, `artigo_subtitulo`, `artigo_resumo`, `artigo_conteudo`, `artigo_imagem_capa`, `artigo_imagens_extras`, `artigo_slug`, `artigo_palavras_chave`, `artigo_descricao_meta`, `artigo_categoria`, `artigo_tags`, `artigo_status`, `artigo_data_publicacao`, `artigo_data_criacao`, `artigo_data_atualizacao`, `artigo_visualizacoes`, `artigo_curtidas`, `artigo_comentarios`, `artigo_destacado`, `artigo_aprovado_admin`, `artigo_observacoes_internas`) VALUES
	(5, 3, 'Entendendo o Câncer: Causas, Sintomas, Tratamentos e Prevenção', 'Uma visão abrangente sobre uma das doenças mais desafiadoras da medicina moderna, com foco em conscientização e cuidados.', 'O câncer é uma doença caracterizada pelo crescimento descontrolado de células anômalas no corpo, afetando milhões de pessoas globalmente. Este artigo explora suas causas principais, sintomas comuns, opções de tratamento e estratégias de prevenção, enfatizando a importância da detecção precoce e do apoio médico. Baseado em dados científicos atualizados, o texto visa informar e conscientizar sobre essa condição, destacando avanços na pesquisa e na medicina.', 'Introdução ao Câncer\r\nO câncer é um grupo de doenças que surge quando células normais do corpo sofrem mutações genéticas, levando a um crescimento descontrolado e invasivo. Segundo a Organização Mundial da Saúde (OMS), cerca de 10 milhões de mortes por ano são atribuídas ao câncer, tornando-o a segunda principal causa de óbito no mundo. Existem mais de 100 tipos de câncer, classificados por órgãos afetados, como pulmão, mama, próstata e pele. A compreensão dessa doença é essencial para a prevenção e o tratamento eficaz.\r\n\r\nCausas e Fatores de Risco\r\nAs causas do câncer são multifatoriais, envolvendo fatores genéticos, ambientais e de estilo de vida. Mutagens como radiação ionizante, substâncias químicas (ex.: tabaco, amianto) e vírus (ex.: HPV, hepatite B) podem danificar o DNA celular. Fatores de risco incluem:\r\n\r\nTabagismo: Responsável por cerca de 22% dos casos globais.\r\nObesidade e sedentarismo: Aumentam o risco de câncer de mama, cólon e endométrio.\r\nExposição solar excessiva: Principal causa do câncer de pele.\r\nHereditariedade: Genes como BRCA1 e BRCA2 elevam o risco de câncer de mama e ovário. Estudos epidemiológicos, como os da American Cancer Society, mostram que cerca de 40% dos casos poderiam ser evitados com mudanças no estilo de vida.\r\nSintomas Comuns\r\nOs sintomas variam conforme o tipo e estágio do câncer, mas sinais de alerta incluem:\r\n\r\nPerda de peso inexplicável.\r\nFadiga persistente.\r\nDor localizada ou generalizada.\r\nMudanças na pele, como feridas que não cicatrizam.\r\nSangramentos anômalos (ex.: tosse com sangue). A detecção precoce por meio de exames de rotina, como mamografia ou colonoscopia, é crucial, pois aumenta as chances de cura em até 90% em estágios iniciais.\r\nTratamentos Disponíveis\r\nO tratamento do câncer é personalizado e pode incluir:\r\n\r\nCirurgia: Remoção do tumor primário.\r\nQuimioterapia: Uso de medicamentos para destruir células cancerosas.\r\nRadioterapia: Radiação direcionada para matar células malignas.\r\nImunoterapia: Estimula o sistema imune a combater o câncer.\r\nTerapia alvo: Ataca especificamente mutações genéticas. Avanços como a terapia CAR-T têm revolucionado tratamentos para leucemias, com taxas de sucesso superiores a 80% em alguns casos. A integração de IA em diagnósticos também melhora a precisão.\r\nPrevenção e Conscientização\r\nA prevenção foca em hábitos saudáveis: não fumar, dieta equilibrada rica em frutas e vegetais, atividade física regular e vacinas (ex.: contra HPV). Programas de rastreamento, como o do SUS no Brasil, ajudam na detecção precoce. Apoio psicológico e grupos de suporte são vitais para pacientes e famílias. Pesquisas recentes indicam que a redução da poluição ambiental poderia prevenir milhões de casos anuais.\r\n\r\nConclusão\r\nO câncer, embora grave, é cada vez mais tratável com avanços científicos. A conscientização, detecção precoce e adoção de estilos de vida saudáveis são armas poderosas contra essa doença. Consulte sempre um profissional de saúde para orientações personalizadas.', 'bff5b46c03dc2abd6cf387091dd6a6c5', NULL, 'entendendo-o-cancer-causas-sintomas-tratamentos-prevencao  Imagem de Cada', 'câncer, oncologia, prevenção de câncer, sintomas de câncer, tratamento de câncer, fatores de risco, detecção precoce, saúde pública', NULL, 'Saúde e Bem-Estar, Oncologia', NULL, 'rascunho', '2025-10-27 18:40:06', '2025-10-27 21:40:06', '2025-10-27 21:50:42', 3, 0, 0, 0, 0, NULL);

-- Copiando estrutura para tabela hotel.doador
CREATE TABLE IF NOT EXISTS `doador` (
  `doador_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `doador_nome` varchar(255) NOT NULL,
  `doador_cpf` varchar(14) DEFAULT NULL,
  `doador_rg` varchar(20) DEFAULT NULL,
  `doador_data_nascimento` date DEFAULT NULL,
  `doador_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `doador_estado_civil` enum('Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','Outro') DEFAULT NULL,
  `doador_profissao` varchar(100) DEFAULT NULL,
  `doador_nacionalidade` varchar(100) DEFAULT 'Brasileira',
  `doador_telefone` varchar(20) DEFAULT NULL,
  `doador_logradouro` varchar(255) DEFAULT NULL,
  `doador_numero` varchar(10) DEFAULT NULL,
  `doador_bairro` varchar(100) DEFAULT NULL,
  `doador_cidade` varchar(100) DEFAULT NULL,
  `doador_estado` varchar(50) DEFAULT NULL,
  `doador_cep` varchar(15) DEFAULT NULL,
  `doador_tipo` enum('Pessoa Física','Pessoa Jurídica') DEFAULT 'Pessoa Física',
  `doador_nome_empresa` varchar(255) DEFAULT NULL,
  `doador_cnpj` varchar(18) DEFAULT NULL,
  `doador_cargo_empresa` varchar(100) DEFAULT NULL,
  `doador_site_empresa` varchar(255) DEFAULT NULL,
  `doador_area_atuacao_empresa` varchar(100) DEFAULT NULL,
  `doador_relacao_instituicao` enum('Nenhuma','Parceria','Voluntário','Familiar de Paciente','Outro') DEFAULT 'Nenhuma',
  `doador_motivo_apoio` text,
  `doador_tipo_doacao` enum('Financeira','Material','Serviço','Alimentos','Outros') DEFAULT 'Financeira',
  `doador_valor_medio` decimal(10,2) DEFAULT NULL,
  `doador_periodicidade_doacao` enum('Única','Mensal','Trimestral','Anual','Variável') DEFAULT 'Única',
  `doador_metodo_pagamento` enum('Pix','Boleto','Cartão de Crédito','Depósito Bancário','Outro') DEFAULT 'Pix',
  `doador_data_ultima_doacao` date DEFAULT NULL,
  `doador_qtd_total_doacoes` int DEFAULT '0',
  `doador_valor_total_doado` decimal(12,2) DEFAULT '0.00',
  `doador_intencao_continuar` tinyint(1) DEFAULT '1',
  `doador_receber_atualizacoes` tinyint(1) DEFAULT '1',
  `doador_receber_certificado` tinyint(1) DEFAULT '0',
  `doador_banco_nome` varchar(100) DEFAULT NULL,
  `doador_banco_agencia` varchar(20) DEFAULT NULL,
  `doador_banco_conta` varchar(20) DEFAULT NULL,
  `doador_banco_tipo_conta` enum('Corrente','Poupança','Pagamento','Outro') DEFAULT NULL,
  `doador_pix_chave` varchar(255) DEFAULT NULL,
  `doador_documento_comprovante` varchar(255) DEFAULT NULL,
  `doador_documento_identidade` varchar(255) DEFAULT NULL,
  `doador_documento_cnpj` varchar(255) DEFAULT NULL,
  `doador_data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `doador_verificado` tinyint(1) DEFAULT '0',
  `doador_aprovado_admin` tinyint(1) DEFAULT '0',
  `doador_observacoes` text,
  `doador_observacoes_internas` text,
  PRIMARY KEY (`doador_id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `doador_id` (`doador_id`),
  UNIQUE KEY `doador_cpf` (`doador_cpf`),
  UNIQUE KEY `doador_cnpj` (`doador_cnpj`),
  CONSTRAINT `fk_doador_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.doador: ~0 rows (aproximadamente)
DELETE FROM `doador`;
INSERT INTO `doador` (`doador_id`, `usuario_id`, `doador_nome`, `doador_cpf`, `doador_rg`, `doador_data_nascimento`, `doador_sexo`, `doador_estado_civil`, `doador_profissao`, `doador_nacionalidade`, `doador_telefone`, `doador_logradouro`, `doador_numero`, `doador_bairro`, `doador_cidade`, `doador_estado`, `doador_cep`, `doador_tipo`, `doador_nome_empresa`, `doador_cnpj`, `doador_cargo_empresa`, `doador_site_empresa`, `doador_area_atuacao_empresa`, `doador_relacao_instituicao`, `doador_motivo_apoio`, `doador_tipo_doacao`, `doador_valor_medio`, `doador_periodicidade_doacao`, `doador_metodo_pagamento`, `doador_data_ultima_doacao`, `doador_qtd_total_doacoes`, `doador_valor_total_doado`, `doador_intencao_continuar`, `doador_receber_atualizacoes`, `doador_receber_certificado`, `doador_banco_nome`, `doador_banco_agencia`, `doador_banco_conta`, `doador_banco_tipo_conta`, `doador_pix_chave`, `doador_documento_comprovante`, `doador_documento_identidade`, `doador_documento_cnpj`, `doador_data_cadastro`, `doador_verificado`, `doador_aprovado_admin`, `doador_observacoes`, `doador_observacoes_internas`) VALUES
	(2, 30, 'Doador', '12345678900', '1234567890', '2020-02-02', 'Feminino', 'Solteiro(a)', 'empresário', 'Brasileira', '11963852741', NULL, NULL, NULL, 'São Paulo', 'SP', '07790852', 'Pessoa Física', NULL, NULL, NULL, NULL, NULL, 'Voluntário', 'Motivação pessoal ', 'Financeira', 100.00, 'Mensal', 'Depósito Bancário', NULL, 0, 0.00, 1, 1, 0, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, '2025-10-26 01:55:20', 0, 0, NULL, NULL);

-- Copiando estrutura para tabela hotel.historico_quarto
CREATE TABLE IF NOT EXISTS `historico_quarto` (
  `historico_quarto_id` int NOT NULL AUTO_INCREMENT,
  `quarto_id` int NOT NULL,
  `reserva_id` int DEFAULT NULL COMMENT 'Reserva que causou a mudança de status/ocupação',
  `historico_quarto_status_anterior` enum('disponivel','ocupado','em_limpeza','manutencao','reservado') DEFAULT NULL,
  `historico_quarto_status_novo` enum('disponivel','ocupado','em_limpeza','manutencao','reservado') NOT NULL,
  `historico_quarto_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admin_id` int DEFAULT NULL COMMENT 'Admin/funcionário que efetuou a alteração',
  `historico_quarto_observacoes` text,
  PRIMARY KEY (`historico_quarto_id`),
  KEY `fk_historico_quarto_quarto` (`quarto_id`),
  KEY `fk_historico_quarto_reserva` (`reserva_id`),
  KEY `fk_historico_quarto_admin` (`admin_id`),
  CONSTRAINT `fk_historico_quarto_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_historico_quarto_quarto` FOREIGN KEY (`quarto_id`) REFERENCES `quarto` (`quarto_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_historico_quarto_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`reserva_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Rastreamento de mudanças de status dos quartos (limpeza, manutenção, etc)';

-- Copiando dados para a tabela hotel.historico_quarto: ~0 rows (aproximadamente)
DELETE FROM `historico_quarto`;

-- Copiando estrutura para tabela hotel.paciente
CREATE TABLE IF NOT EXISTS `paciente` (
  `paciente_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `paciente_email` varchar(100) NOT NULL DEFAULT '',
  `paciente_nome` varchar(255) NOT NULL,
  `paciente_cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paciente_rg` varchar(20) DEFAULT NULL,
  `paciente_nacionalidade` varchar(100) DEFAULT 'Brasileira',
  `paciente_data_nascimento` date DEFAULT NULL,
  `paciente_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `paciente_estado_civil` enum('Solteiro','Casado','Divorciado','Viúvo','Outro') DEFAULT NULL,
  `paciente_altura` decimal(4,2) DEFAULT NULL,
  `paciente_peso` decimal(5,2) DEFAULT NULL,
  `paciente_tipo_sanguineo` varchar(5) DEFAULT NULL,
  `paciente_profissao` varchar(100) DEFAULT NULL,
  `paciente_telefone` varchar(20) DEFAULT NULL,
  `paciente_logradouro` varchar(255) DEFAULT NULL,
  `paciente_numero` varchar(10) DEFAULT NULL,
  `paciente_bairro` varchar(100) DEFAULT NULL,
  `paciente_cidade` varchar(100) DEFAULT NULL,
  `paciente_estado` varchar(50) DEFAULT NULL,
  `paciente_cep` varchar(10) DEFAULT NULL,
  `paciente_necessidades_especiais_hospedagem` text,
  `paciente_restricoes_mobilidade` text,
  `paciente_restricoes_alimentares` text,
  `paciente_contato_emergencia_1_nome` varchar(255) NOT NULL,
  `paciente_contato_emergencia_1_parentesco` varchar(100) NOT NULL,
  `paciente_contato_emergencia_1_telefone` varchar(20) NOT NULL,
  `paciente_contato_emergencia_2_nome` varchar(255) DEFAULT NULL,
  `paciente_contato_emergencia_2_parentesco` varchar(100) DEFAULT NULL,
  `paciente_contato_emergencia_2_telefone` varchar(20) DEFAULT NULL,
  `paciente_responsavel_legal_nome` varchar(255) DEFAULT NULL,
  `paciente_responsavel_legal_parentesco` varchar(100) DEFAULT NULL,
  `paciente_responsavel_legal_telefone` varchar(20) DEFAULT NULL,
  `paciente_contato_emergencia_email` varchar(255) DEFAULT NULL,
  `paciente_centro_tratamento_nome` varchar(255) DEFAULT NULL,
  `paciente_medico_assistente_nome` varchar(255) DEFAULT NULL,
  `paciente_diagnostico` text,
  `paciente_fase_tratamento` varchar(100) DEFAULT NULL,
  `paciente_tipo_tratamento` varchar(100) DEFAULT NULL,
  `paciente_tempo_tratamento` varchar(100) DEFAULT NULL,
  `paciente_data_ultima_sessao` date DEFAULT NULL,
  `paciente_historico_medico_resumido` text,
  `paciente_alergias_risco` text,
  `paciente_alergias_medicamentosas_detalhe` text,
  `paciente_medicamentos_uso_essenciais` text,
  `paciente_vulnerabilidade_imunossupressao` tinyint(1) DEFAULT '0',
  `paciente_restricoes_fisicas` text,
  `paciente_plano_saude_nome` varchar(255) DEFAULT NULL,
  `paciente_numero_carteirinha` varchar(50) DEFAULT NULL,
  `paciente_preferencia_horario_refeicao` enum('Manhã','Tarde','Noite','Indiferente') DEFAULT 'Indiferente',
  `paciente_observacoes_enfermagem` text,
  `paciente_observacoes_gerais` text,
  PRIMARY KEY (`paciente_id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `paciente_id` (`paciente_id`),
  UNIQUE KEY `paciente_email` (`paciente_email`),
  UNIQUE KEY `paciente_cpf` (`paciente_cpf`),
  CONSTRAINT `fk_paciente_email` FOREIGN KEY (`paciente_email`) REFERENCES `usuario` (`usuario_email`),
  CONSTRAINT `fk_paciente_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.paciente: ~3 rows (aproximadamente)
DELETE FROM `paciente`;
INSERT INTO `paciente` (`paciente_id`, `usuario_id`, `paciente_email`, `paciente_nome`, `paciente_cpf`, `paciente_rg`, `paciente_nacionalidade`, `paciente_data_nascimento`, `paciente_sexo`, `paciente_estado_civil`, `paciente_altura`, `paciente_peso`, `paciente_tipo_sanguineo`, `paciente_profissao`, `paciente_telefone`, `paciente_logradouro`, `paciente_numero`, `paciente_bairro`, `paciente_cidade`, `paciente_estado`, `paciente_cep`, `paciente_necessidades_especiais_hospedagem`, `paciente_restricoes_mobilidade`, `paciente_restricoes_alimentares`, `paciente_contato_emergencia_1_nome`, `paciente_contato_emergencia_1_parentesco`, `paciente_contato_emergencia_1_telefone`, `paciente_contato_emergencia_2_nome`, `paciente_contato_emergencia_2_parentesco`, `paciente_contato_emergencia_2_telefone`, `paciente_responsavel_legal_nome`, `paciente_responsavel_legal_parentesco`, `paciente_responsavel_legal_telefone`, `paciente_contato_emergencia_email`, `paciente_centro_tratamento_nome`, `paciente_medico_assistente_nome`, `paciente_diagnostico`, `paciente_fase_tratamento`, `paciente_tipo_tratamento`, `paciente_tempo_tratamento`, `paciente_data_ultima_sessao`, `paciente_historico_medico_resumido`, `paciente_alergias_risco`, `paciente_alergias_medicamentosas_detalhe`, `paciente_medicamentos_uso_essenciais`, `paciente_vulnerabilidade_imunossupressao`, `paciente_restricoes_fisicas`, `paciente_plano_saude_nome`, `paciente_numero_carteirinha`, `paciente_preferencia_horario_refeicao`, `paciente_observacoes_enfermagem`, `paciente_observacoes_gerais`) VALUES
	(2, 25, 'paciente@gmail.com', 'paciente', '123456789000', NULL, 'Brasileira', '2000-01-01', 'Feminino', 'Solteiro', NULL, NULL, NULL, NULL, '11963852741', 'Avenida Um', '133', '11', '', '', NULL, 'nenhuma', 'nenhuma', 'amendoim', 'contato1', 'mãe', '11963852741', 'contato2', 'pai', '11963852741', NULL, NULL, NULL, NULL, 'Sírio Libanês', 'médico', NULL, '4', NULL, '4 anos', '2025-10-22', NULL, 'amendoim', NULL, 'nenhum', 0, NULL, NULL, NULL, 'Indiferente', NULL, 'nenhuma'),
	(3, 32, 'paciente1@gmail.com', 'paciente1', '123456789001', NULL, 'Brasileira', '2020-02-02', 'Masculino', 'Solteiro', NULL, NULL, NULL, NULL, '11963852741', 'Avenida Um', '', '', '', '', NULL, 'Nenhuma', 'Nenhuma', 'Nenhuma', 'contato1', 'mãe', '11963852741', 'contato2', 'pai', '11963852741', NULL, NULL, NULL, NULL, 'Sírio Libanês', 'médico', NULL, '4', NULL, '4 anos', '2020-02-02', NULL, 'Nenhuma', NULL, 'Nenhuma', 0, NULL, NULL, NULL, 'Indiferente', NULL, 'Nenhuma'),
	(4, 33, 'paciente2@gmail.com', 'paciente2', '123456789002', NULL, 'Brasileira', '2020-02-02', 'Feminino', 'Viúvo', NULL, NULL, NULL, NULL, '11963852741', 'Avenida Um', NULL, NULL, NULL, NULL, NULL, 'nenhuma', 'nenhuma', 'nenhuma', 'contato1', 'mãe', '11963852741', 'contato2', 'pai', '11963852741', NULL, NULL, NULL, NULL, 'Sírio Libanês', 'médico', NULL, '4', NULL, '4 anos', '2020-02-02', NULL, 'nenhuma', NULL, 'nenhuma', 0, NULL, NULL, NULL, 'Indiferente', NULL, 'nenhuma');

-- Copiando estrutura para tabela hotel.pergunta
CREATE TABLE IF NOT EXISTS `pergunta` (
  `pergunta_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `pergunta_titulo` varchar(255) NOT NULL,
  `pergunta_conteudo` text NOT NULL,
  `pergunta_categoria` varchar(100) DEFAULT NULL COMMENT 'Categoria opcional (ex: saúde, doações, hospedagem)',
  `pergunta_tags` varchar(255) DEFAULT NULL COMMENT 'Tags separadas por vírgula',
  `pergunta_status` enum('publicada','oculta','removida','pendente') DEFAULT 'publicada',
  `pergunta_destacada` tinyint(1) DEFAULT '0' COMMENT 'Se a pergunta aparece em destaque no topo',
  `pergunta_visualizacoes` int DEFAULT '0',
  `pergunta_curtidas` int DEFAULT '0',
  `pergunta_qtd_respostas` int DEFAULT '0',
  `pergunta_aprovada_admin` tinyint(1) DEFAULT '0' COMMENT 'Se foi revisada e aprovada por um admin',
  `pergunta_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pergunta_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pergunta_data_ultima_resposta` datetime DEFAULT NULL,
  `pergunta_editada` tinyint(1) DEFAULT '0' COMMENT 'Indica se foi editada pelo autor',
  `pergunta_editada_por` int DEFAULT NULL COMMENT 'ID do usuário que editou (pode ser admin)',
  `pergunta_deletada` tinyint(1) DEFAULT '0' COMMENT 'Exclusão lógica (1=removida)',
  `pergunta_ip_criacao` varchar(45) DEFAULT NULL COMMENT 'IP de origem da criação',
  `pergunta_observacoes` text COMMENT 'Comentários públicos adicionais',
  `pergunta_observacoes_internas` text COMMENT 'Anotações internas do admin/moderador',
  PRIMARY KEY (`pergunta_id`),
  KEY `fk_pergunta_usuario` (`usuario_id`),
  CONSTRAINT `fk_pergunta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.pergunta: ~4 rows (aproximadamente)
DELETE FROM `pergunta`;
INSERT INTO `pergunta` (`pergunta_id`, `usuario_id`, `pergunta_titulo`, `pergunta_conteudo`, `pergunta_categoria`, `pergunta_tags`, `pergunta_status`, `pergunta_destacada`, `pergunta_visualizacoes`, `pergunta_curtidas`, `pergunta_qtd_respostas`, `pergunta_aprovada_admin`, `pergunta_data_criacao`, `pergunta_data_atualizacao`, `pergunta_data_ultima_resposta`, `pergunta_editada`, `pergunta_editada_por`, `pergunta_deletada`, `pergunta_ip_criacao`, `pergunta_observacoes`, `pergunta_observacoes_internas`) VALUES
	(6, 25, 'Reservas', 'Gostaria de saber como faço para fazer uma reserva.', NULL, NULL, 'publicada', 0, 0, 0, 0, 0, '2025-10-24 01:10:07', '2025-10-24 01:10:07', NULL, 0, NULL, 0, '::1', NULL, NULL),
	(7, 25, 'Acompanhantes', 'O hotel aceita acompanhantes durante a estadia?', NULL, NULL, 'publicada', 0, 0, 0, 0, 0, '2025-10-24 01:10:21', '2025-10-24 01:10:21', NULL, 0, NULL, 0, '::1', NULL, NULL),
	(8, 25, 'Refeições', 'As refeições estão incluídas na diária?', NULL, NULL, 'publicada', 0, 0, 0, 0, 0, '2025-10-24 01:10:41', '2025-10-24 01:10:41', NULL, 0, NULL, 0, '::1', NULL, NULL),
	(9, 25, 'Ambiente', 'O ambiente é adaptado para pacientes em tratamento?', NULL, NULL, 'publicada', 0, 0, 0, 0, 0, '2025-10-24 01:11:00', '2025-10-24 01:11:00', NULL, 0, NULL, 0, '::1', NULL, NULL);

-- Copiando estrutura para tabela hotel.quarto
CREATE TABLE IF NOT EXISTS `quarto` (
  `quarto_id` int NOT NULL AUTO_INCREMENT,
  `tipo_quarto_id` int NOT NULL,
  `quarto_numero` varchar(10) NOT NULL COMMENT 'Ex.: 101, A-01',
  `quarto_andar` varchar(50) DEFAULT NULL,
  `quarto_status` enum('disponivel','ocupado','em_limpeza','manutencao','reservado') DEFAULT 'disponivel',
  `quarto_observacoes` text COMMENT 'Ex.: Vista para jardim',
  `quarto_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quarto_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quarto_id`),
  UNIQUE KEY `quarto_numero` (`quarto_numero`),
  KEY `fk_quarto_tipo_quarto` (`tipo_quarto_id`),
  CONSTRAINT `fk_quarto_tipo_quarto` FOREIGN KEY (`tipo_quarto_id`) REFERENCES `tipo_quarto` (`tipo_quarto_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Detalhes dos quartos físicos do hotel';

-- Copiando dados para a tabela hotel.quarto: ~5 rows (aproximadamente)
DELETE FROM `quarto`;
INSERT INTO `quarto` (`quarto_id`, `tipo_quarto_id`, `quarto_numero`, `quarto_andar`, `quarto_status`, `quarto_observacoes`, `quarto_data_criacao`, `quarto_data_atualizacao`) VALUES
	(1, 1, '1', NULL, 'disponivel', 'teste', '2025-10-30 20:34:55', '2025-11-01 01:50:32'),
	(2, 1, '101', 'Térreo', 'disponivel', 'Vista para o jardim', '2025-10-31 01:33:37', '2025-11-01 20:52:58'),
	(3, 1, '102', 'Térreo', 'disponivel', 'Adaptado', '2025-10-31 01:33:37', '2025-11-01 20:52:59'),
	(4, 2, '201', '1º Andar', 'disponivel', 'Próximo ao elevador', '2025-10-31 01:33:37', '2025-11-01 20:53:04'),
	(5, 3, '301', '2º Andar', 'disponivel', 'Amplo e iluminado', '2025-10-31 01:33:37', '2025-11-01 20:53:06');

-- Copiando estrutura para tabela hotel.quarto_fotos
CREATE TABLE IF NOT EXISTS `quarto_fotos` (
  `foto_id` int NOT NULL AUTO_INCREMENT,
  `quarto_id` int NOT NULL,
  `foto_caminho` varchar(255) NOT NULL,
  `foto_ordem` int DEFAULT '1',
  PRIMARY KEY (`foto_id`),
  KEY `quarto_id` (`quarto_id`),
  CONSTRAINT `quarto_fotos_ibfk_1` FOREIGN KEY (`quarto_id`) REFERENCES `quarto` (`quarto_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.quarto_fotos: ~6 rows (aproximadamente)
DELETE FROM `quarto_fotos`;
INSERT INTO `quarto_fotos` (`foto_id`, `quarto_id`, `foto_caminho`, `foto_ordem`) VALUES
	(1, 1, '/img/quartos/quarto101_1.jpg', 1),
	(2, 1, '/img/quartos/quarto101_2.jpg', 2),
	(3, 1, '/img/quartos/quarto101_3.jpg', 3),
	(4, 2, '/img/quartos/quarto102_1.jpg', 1),
	(5, 2, '/img/quartos/quarto102_2.jpg', 2),
	(6, 2, '/img/quartos/quarto102_3.jpg', 3);
  (7, 3, '/img/quartos/quarto103_1.jpg', 1),
	(8, 3, '/img/quartos/quarto103_2.jpg', 2),
	(9, 3, '/img/quartos/quarto103_3.jpg', 3);

-- Copiando estrutura para tabela hotel.reserva
CREATE TABLE IF NOT EXISTS `reserva` (
  `reserva_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `acompanhante_id` int DEFAULT NULL,
  `quarto_id` int NOT NULL,
  `admin_id` int DEFAULT NULL COMMENT 'Admin que registrou ou aprovou a reserva (para auditoria)',
  `reserva_data_checkin_previsto` datetime NOT NULL COMMENT 'Data e hora prevista para o check-in',
  `reserva_data_checkout_previsto` datetime NOT NULL COMMENT 'Data e hora prevista para o check-out',
  `reserva_data_checkin_real` datetime DEFAULT NULL COMMENT 'Data e hora real do check-in (preenchido na hora)',
  `reserva_data_checkout_real` datetime DEFAULT NULL,
  `reserva_num_hospedes` int NOT NULL DEFAULT '1' COMMENT 'Total de pessoas (paciente + acompanhantes)',
  `reserva_duracao_dias` int DEFAULT NULL COMMENT 'Pode ser calculado por trigger ou na aplicação',
  `reserva_status` enum('pendente','confirmada','em_andamento','concluida','cancelada','no-show') DEFAULT 'pendente',
  `reserva_motivo` text COMMENT 'Ex.: Tratamento quimioterapia, Pós-operatório',
  `reserva_necessidades_especiais` text COMMENT 'Necessidades específicas para a estadia',
  `reserva_valor_diaria` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Valor da diária do quarto no momento da reserva',
  `reserva_valor_servicos` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Soma dos serviços adicionais',
  `reserva_valor_total` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Soma total',
  `reserva_desconto` decimal(10,2) DEFAULT '0.00',
  `reserva_admin_aprovou` tinyint(1) DEFAULT '0' COMMENT 'Se a reserva foi revisada e aprovada por um admin',
  `reserva_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reserva_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reserva_observacoes` text,
  `reserva_observacoes_internas` text,
  PRIMARY KEY (`reserva_id`),
  KEY `fk_reserva_paciente` (`paciente_id`),
  KEY `fk_reserva_acompanhante` (`acompanhante_id`),
  KEY `fk_reserva_quarto` (`quarto_id`),
  KEY `fk_reserva_admin` (`admin_id`),
  CONSTRAINT `fk_reserva_acompanhante` FOREIGN KEY (`acompanhante_id`) REFERENCES `acompanhante` (`acompanhante_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reserva_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reserva_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`paciente_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reserva_quarto` FOREIGN KEY (`quarto_id`) REFERENCES `quarto` (`quarto_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro central das reservas';

-- Copiando dados para a tabela hotel.reserva: ~5 rows (aproximadamente)
DELETE FROM `reserva`;
INSERT INTO `reserva` (`reserva_id`, `paciente_id`, `acompanhante_id`, `quarto_id`, `admin_id`, `reserva_data_checkin_previsto`, `reserva_data_checkout_previsto`, `reserva_data_checkin_real`, `reserva_data_checkout_real`, `reserva_num_hospedes`, `reserva_duracao_dias`, `reserva_status`, `reserva_motivo`, `reserva_necessidades_especiais`, `reserva_valor_diaria`, `reserva_valor_servicos`, `reserva_valor_total`, `reserva_desconto`, `reserva_admin_aprovou`, `reserva_data_criacao`, `reserva_data_atualizacao`, `reserva_observacoes`, `reserva_observacoes_internas`) VALUES
	(1, 2, NULL, 1, NULL, '2025-11-01 15:00:00', '2025-11-05 17:00:00', NULL, NULL, 1, NULL, 'cancelada', 'teste', NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-10-30 20:35:44', '2025-10-31 00:39:12', '', NULL),
	(4, 2, NULL, 1, NULL, '2020-02-02 05:02:00', '2020-02-02 05:02:00', NULL, NULL, 1, NULL, 'confirmada', '', NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-10-30 21:58:49', '2025-10-31 00:35:16', NULL, NULL),
	(5, 3, NULL, 1, NULL, '2020-02-02 02:21:00', '2020-02-20 02:20:00', NULL, NULL, 1, NULL, 'pendente', '', NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-10-30 22:30:42', '2025-10-30 22:30:42', NULL, NULL),
	(6, 3, NULL, 1, NULL, '2020-02-02 02:02:00', '2020-02-02 02:02:00', NULL, NULL, 1, NULL, 'pendente', '', NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-10-30 22:32:07', '2025-10-30 22:32:07', NULL, NULL),
	(8, 3, NULL, 1, NULL, '2025-10-30 02:22:00', '2025-11-01 02:02:00', NULL, NULL, 1, NULL, 'pendente', '', NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-10-31 00:41:45', '2025-10-31 00:41:45', NULL, NULL);

-- Copiando estrutura para tabela hotel.resposta
CREATE TABLE IF NOT EXISTS `resposta` (
  `resposta_id` int NOT NULL AUTO_INCREMENT,
  `pergunta_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `resposta_conteudo` text NOT NULL,
  `resposta_pai_id` int DEFAULT NULL COMMENT 'Permite respostas a outras respostas',
  `resposta_status` enum('publicada','oculta','removida','pendente') DEFAULT 'publicada',
  `resposta_curtidas` int DEFAULT '0',
  `resposta_visualizacoes` int DEFAULT '0',
  `resposta_aprovada_admin` tinyint(1) DEFAULT '0',
  `resposta_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resposta_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resposta_editada` tinyint(1) DEFAULT '0',
  `resposta_editada_por` int DEFAULT NULL COMMENT 'ID do usuário que editou (pode ser admin)',
  `resposta_deletada` tinyint(1) DEFAULT '0',
  `resposta_ip_criacao` varchar(45) DEFAULT NULL,
  `resposta_observacoes` text,
  `resposta_observacoes_internas` text,
  PRIMARY KEY (`resposta_id`),
  KEY `fk_resposta_pergunta` (`pergunta_id`),
  KEY `fk_resposta_usuario` (`usuario_id`),
  KEY `fk_resposta_pai` (`resposta_pai_id`),
  CONSTRAINT `fk_resposta_pai` FOREIGN KEY (`resposta_pai_id`) REFERENCES `resposta` (`resposta_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resposta_pergunta` FOREIGN KEY (`pergunta_id`) REFERENCES `pergunta` (`pergunta_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resposta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.resposta: ~0 rows (aproximadamente)
DELETE FROM `resposta`;

-- Copiando estrutura para tabela hotel.servico_adicional
CREATE TABLE IF NOT EXISTS `servico_adicional` (
  `servico_adicional_id` int NOT NULL AUTO_INCREMENT,
  `servico_adicional_nome` varchar(100) NOT NULL COMMENT 'Ex.: Refeição Especial, Transporte',
  `servico_adicional_descricao` text,
  `servico_adicional_preco` decimal(10,2) NOT NULL COMMENT 'Preço atual do serviço',
  `servico_adicional_status` enum('ativo','inativo') DEFAULT 'ativo',
  `servico_adicional_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `servico_adicional_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `servico_adicional_observacoes` text,
  PRIMARY KEY (`servico_adicional_id`),
  UNIQUE KEY `servico_adicional_nome` (`servico_adicional_nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de serviços extras';

-- Copiando dados para a tabela hotel.servico_adicional: ~0 rows (aproximadamente)
DELETE FROM `servico_adicional`;

-- Copiando estrutura para tabela hotel.tipo_quarto
CREATE TABLE IF NOT EXISTS `tipo_quarto` (
  `tipo_quarto_id` int NOT NULL AUTO_INCREMENT,
  `tipo_quarto_nome` varchar(100) NOT NULL COMMENT 'Ex.: Individual Adaptado, Duplo Simples',
  `tipo_quarto_descricao` text COMMENT 'Descrição das características e facilidades',
  `tipo_quarto_capacidade_pacientes` int NOT NULL DEFAULT '1' COMMENT 'Capacidade máxima de pacientes',
  `tipo_quarto_capacidade_acompanhantes` int NOT NULL DEFAULT '1' COMMENT 'Capacidade máxima de acompanhantes',
  `tipo_quarto_necessidades_especiais` text COMMENT 'Ex.: Adaptações para cadeirantes, recursos especiais',
  `tipo_quarto_status` enum('ativo','inativo') DEFAULT 'ativo',
  `tipo_quarto_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_quarto_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tipo_quarto_observacoes` text,
  PRIMARY KEY (`tipo_quarto_id`),
  UNIQUE KEY `tipo_quarto_nome` (`tipo_quarto_nome`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tipos de acomodação disponíveis no hotel';

-- Copiando dados para a tabela hotel.tipo_quarto: ~4 rows (aproximadamente)
DELETE FROM `tipo_quarto`;
INSERT INTO `tipo_quarto` (`tipo_quarto_id`, `tipo_quarto_nome`, `tipo_quarto_descricao`, `tipo_quarto_capacidade_pacientes`, `tipo_quarto_capacidade_acompanhantes`, `tipo_quarto_necessidades_especiais`, `tipo_quarto_status`, `tipo_quarto_data_criacao`, `tipo_quarto_data_atualizacao`, `tipo_quarto_observacoes`) VALUES
	(1, 'teste', 'teste', 1, 1, 'teste', 'ativo', '2025-10-30 20:33:49', '2025-10-30 20:34:31', 'teste'),
	(2, 'Individual Adaptado', 'Quarto individual com adaptações para cadeirantes.', 1, 1, NULL, 'ativo', '2025-10-31 01:31:56', '2025-10-31 01:31:56', NULL),
	(3, 'Duplo Simples', 'Quarto duplo simples com banheiro compartilhado.', 2, 2, NULL, 'ativo', '2025-10-31 01:31:56', '2025-10-31 01:31:56', NULL),
	(4, 'Familiar', 'Quarto amplo para paciente e familiares, com TV e geladeira.', 3, 3, NULL, 'ativo', '2025-10-31 01:31:56', '2025-10-31 01:31:56', NULL);

-- Copiando estrutura para tabela hotel.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `usuario_email` varchar(255) NOT NULL,
  `usuario_senha` varchar(255) NOT NULL,
  `usuario_tipo` enum('paciente','acompanhante','doador','voluntario','admin') NOT NULL,
  `usuario_data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_estado` enum('ativo','inativo') DEFAULT 'ativo',
  `usuario_ultimo_login` datetime DEFAULT NULL,
  `usuario_foto_perfil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '/uploads/usuarios/padrao.png',
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `usuario_email` (`usuario_email`),
  UNIQUE KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.usuario: ~7 rows (aproximadamente)
DELETE FROM `usuario`;
INSERT INTO `usuario` (`usuario_id`, `usuario_email`, `usuario_senha`, `usuario_tipo`, `usuario_data_criacao`, `usuario_estado`, `usuario_ultimo_login`, `usuario_foto_perfil`) VALUES
	(25, 'paciente@gmail.com', '$2b$10$vzkP7Uaw.XdtM74F4Q6m6ufs8EH3v01JbLXXNL7q4j42uohtgVgJa', 'paciente', '2025-10-23 21:45:01', 'ativo', '2025-11-01 20:40:56', '/uploads/usuarios/padrao.png'),
	(26, 'admin@gmail.com', '$2b$10$LDsQserWeAQGEfUpat7R2eYhXFlO14WtwOu00uwAi91PCQB/XXfoa', 'admin', '2025-10-23 22:05:20', 'ativo', '2025-10-30 23:11:30', '/uploads/usuarios/padrao.png'),
	(28, 'acompanhante@gmail.com', '$2b$10$..xkt1YclmgrSspbx1NtZe2BMJ7kmbCjKVzYMAGnO0dGMyukIj6y2', 'acompanhante', '2025-10-25 22:30:22', 'ativo', '2025-10-25 22:53:43', '/uploads/usuarios/padrao.png'),
	(29, 'voluntario@gmail.com', '$2b$10$BTOsHbvjiQJPBNM6SU/sW.QNA.bFYqRSGzg1bfxOoOcoazkHEBSYa', 'voluntario', '2025-10-25 22:35:31', 'ativo', '2025-10-25 22:51:19', '/uploads/usuarios/padrao.png'),
	(30, 'doador@gmail.com', '$2b$10$2v3.hZXtdJWcpoigB.vaj.ST6t.ElyqQUmUTR7QvxsmrUU3b1kHKe', 'doador', '2025-10-25 22:54:01', 'ativo', '2025-10-25 23:29:30', '/uploads/usuarios/padrao.png'),
	(32, 'paciente1@gmail.com', '$2b$10$b.KUsOyx7zWrfeIWttHQvOpK90c.RkwU6sIzPcRK8uiCfY6LSuoTq', 'paciente', '2025-10-28 15:52:52', 'ativo', '2025-10-28 15:54:40', '/uploads/usuarios/padrao.png'),
	(33, 'paciente2@gmail.com', '$2b$10$J0c1rZbn3aYbHAMbfNb2seGsS6nZEYaaGENbATuG3kUXwdlsvw3V2', 'paciente', '2025-10-28 19:28:37', 'ativo', '2025-10-28 22:22:52', '/uploads/usuarios/padrao.png');

-- Copiando estrutura para tabela hotel.voluntario
CREATE TABLE IF NOT EXISTS `voluntario` (
  `voluntario_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `voluntario_nome` varchar(255) NOT NULL,
  `voluntario_cpf` varchar(14) DEFAULT NULL,
  `voluntario_rg` varchar(20) DEFAULT NULL,
  `voluntario_data_nascimento` date DEFAULT NULL,
  `voluntario_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `voluntario_estado_civil` enum('Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','Outro') DEFAULT NULL,
  `voluntario_telefone` varchar(20) DEFAULT NULL,
  `voluntario_endereco` varchar(255) DEFAULT NULL,
  `voluntario_cidade` varchar(100) DEFAULT NULL,
  `voluntario_estado` varchar(50) DEFAULT NULL,
  `voluntario_area_atuacao` varchar(150) DEFAULT NULL,
  `voluntario_habilidades` text,
  `voluntario_disponibilidade` enum('Integral','Parcial','Fins de Semana','Eventual') DEFAULT NULL,
  `voluntario_horarios_disponiveis` text,
  `voluntario_experiencia_previa` text,
  `voluntario_certificado` tinyint(1) DEFAULT '0',
  `voluntario_data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voluntario_verificado` tinyint(1) DEFAULT '0',
  `voluntario_observacoes` text,
  PRIMARY KEY (`voluntario_id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `voluntario_id` (`voluntario_id`),
  UNIQUE KEY `voluntario_cpf` (`voluntario_cpf`),
  CONSTRAINT `fk_voluntario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.voluntario: ~0 rows (aproximadamente)
DELETE FROM `voluntario`;
INSERT INTO `voluntario` (`voluntario_id`, `usuario_id`, `voluntario_nome`, `voluntario_cpf`, `voluntario_rg`, `voluntario_data_nascimento`, `voluntario_sexo`, `voluntario_estado_civil`, `voluntario_telefone`, `voluntario_endereco`, `voluntario_cidade`, `voluntario_estado`, `voluntario_area_atuacao`, `voluntario_habilidades`, `voluntario_disponibilidade`, `voluntario_horarios_disponiveis`, `voluntario_experiencia_previa`, `voluntario_certificado`, `voluntario_data_cadastro`, `voluntario_verificado`, `voluntario_observacoes`) VALUES
	(2, 29, 'voluntario', '12345678900', '1234567890', '2020-02-02', 'Feminino', 'Solteiro(a)', '11963258741', 'avenida um', 'são paulo', 'SP', 'cuidados hospitalares', 'Cuidado, carinho, gentileza', 'Integral', '11h', 'Nenhuma', 1, '2025-10-26 01:40:42', 0, 'Nenhuma');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
