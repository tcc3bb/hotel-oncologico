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
  `acompanhante_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_nome` varchar(255) NOT NULL,
  `acompanhante_cpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_rg` varchar(20) DEFAULT NULL,
  `acompanhante_data_nascimento` date NOT NULL,
  `acompanhante_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `acompanhante_parentesco` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `acompanhante_endereco` varchar(255) DEFAULT NULL,
  `acompanhante_numero` int DEFAULT NULL,
  `acompanhante_complemento` int DEFAULT NULL,
  `acompanhante_cidade` varchar(100) DEFAULT NULL,
  `acompanhante_estado` varchar(50) DEFAULT NULL,
  `paciente_email` varchar(255) NOT NULL,
  `acompanhante_observacoes` text,
  PRIMARY KEY (`acompanhante_id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `acompanhante_id` (`acompanhante_id`),
  UNIQUE KEY `acompanhante_cpf` (`acompanhante_cpf`),
  KEY `idx_paciente_email` (`paciente_email`),
  KEY `idx_acompanhante_email` (`acompanhante_email`),
  CONSTRAINT `fk_acompanhante_paciente` FOREIGN KEY (`paciente_email`) REFERENCES `paciente` (`paciente_email`),
  CONSTRAINT `fk_acompanhante_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_acompanhante_usuario_email` FOREIGN KEY (`acompanhante_email`) REFERENCES `usuario` (`usuario_email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.acompanhante: ~2 rows (aproximadamente)
DELETE FROM `acompanhante`;
INSERT INTO `acompanhante` (`acompanhante_id`, `usuario_id`, `acompanhante_email`, `acompanhante_nome`, `acompanhante_cpf`, `acompanhante_rg`, `acompanhante_data_nascimento`, `acompanhante_sexo`, `acompanhante_parentesco`, `acompanhante_telefone`, `acompanhante_endereco`, `acompanhante_numero`, `acompanhante_complemento`, `acompanhante_cidade`, `acompanhante_estado`, `paciente_email`, `acompanhante_observacoes`) VALUES
	(5, 53, 'acompanhante@gmail.com', 'acompanhante', '536424536777', '56.563.563.4', '2025-11-13', 'Masculino', 'pai', '11975685362', 'avenida um', 2, 85, 'são paulo', 'SP', 'paciente@gmail.com', 'nenhuma'),
	(6, 54, 'teste2@gmail.com', 'acompanhante', '536424536778', '56.563.563.4', '2020-03-02', NULL, 'pai', '11963852741', 'avenida um', 2, 85, 'são paulo', 'SP', 'joao.silva@email.com', '');

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.artigo: ~1 rows (aproximadamente)
DELETE FROM `artigo`;
INSERT INTO `artigo` (`artigo_id`, `admin_id`, `artigo_titulo`, `artigo_subtitulo`, `artigo_resumo`, `artigo_conteudo`, `artigo_imagem_capa`, `artigo_imagens_extras`, `artigo_slug`, `artigo_palavras_chave`, `artigo_descricao_meta`, `artigo_categoria`, `artigo_tags`, `artigo_status`, `artigo_data_publicacao`, `artigo_data_criacao`, `artigo_data_atualizacao`, `artigo_visualizacoes`, `artigo_curtidas`, `artigo_comentarios`, `artigo_destacado`, `artigo_aprovado_admin`, `artigo_observacoes_internas`) VALUES
	(7, 3, 'Câncer: Entendendo a Doença, Prevenção e Caminhos para o Futuro', 'Como o diagnóstico precoce, a ciência moderna e novos tratamentos estão revolucionando a luta contra o câncer', 'O câncer é uma das doenças mais desafiadoras da atualidade, mas os avanços científicos têm transformado sua prevenção, diagnóstico e tratamento. Compreender como a doença surge, seus principais fatores de risco e as estratégias de proteção é essencial para reduzir casos e melhorar a qualidade de vida dos pacientes. Este artigo explora de forma clara e completa tudo o que você precisa saber sobre o câncer hoje.', '<h2 data-start="884" data-end="913">📌 <strong data-start="890" data-end="911">O que &eacute; o c&acirc;ncer?</strong></h2>\r\n<p data-start="914" data-end="1171">O c&acirc;ncer &eacute; um grupo de doen&ccedil;as caracterizado pelo crescimento descontrolado de c&eacute;lulas anormais. Essas c&eacute;lulas podem invadir tecidos, comprometer o funcionamento de &oacute;rg&atilde;os e, em casos avan&ccedil;ados, se espalhar para outras partes do corpo por meio da met&aacute;stase.</p>\r\n<p data-start="1173" data-end="1404">Normalmente, o corpo controla o ciclo de vida das c&eacute;lulas. Quando esse sistema falha &mdash; seja por muta&ccedil;&otilde;es gen&eacute;ticas naturais, influ&ecirc;ncias externas ou predisposi&ccedil;&atilde;o heredit&aacute;ria &mdash; surge a possibilidade de forma&ccedil;&atilde;o de tumores malignos.</p>\r\n<hr data-start="1406" data-end="1409">\r\n<h2 data-start="1411" data-end="1448">📌 <strong data-start="1417" data-end="1448">Principais fatores de risco</strong></h2>\r\n<p data-start="1450" data-end="1543">A ci&ecirc;ncia j&aacute; identificou diversos fatores que aumentam a probabilidade de desenvolver c&acirc;ncer:</p>\r\n<ul data-start="1545" data-end="2064">\r\n<li data-start="1545" data-end="1612">\r\n<p data-start="1547" data-end="1612"><strong data-start="1547" data-end="1561">Tabagismo:</strong> respons&aacute;vel por mais de 30% dos casos evit&aacute;veis.</p>\r\n</li>\r\n<li data-start="1613" data-end="1682">\r\n<p data-start="1615" data-end="1682"><strong data-start="1615" data-end="1645">Exposi&ccedil;&atilde;o solar excessiva:</strong> principal causa de c&acirc;ncer de pele.</p>\r\n</li>\r\n<li data-start="1683" data-end="1765">\r\n<p data-start="1685" data-end="1765"><strong data-start="1685" data-end="1712">Alimenta&ccedil;&atilde;o inadequada:</strong> dietas ricas em ultraprocessados e gorduras trans.</p>\r\n</li>\r\n<li data-start="1766" data-end="1849">\r\n<p data-start="1768" data-end="1849"><strong data-start="1768" data-end="1785">Sedentarismo:</strong> aumenta risco de diversos tipos, como mama, c&oacute;lon e p&acirc;ncreas.</p>\r\n</li>\r\n<li data-start="1850" data-end="1916">\r\n<p data-start="1852" data-end="1916"><strong data-start="1852" data-end="1874">Consumo de &aacute;lcool:</strong> quanto maior a ingest&atilde;o, maior o risco.</p>\r\n</li>\r\n<li data-start="1917" data-end="1974">\r\n<p data-start="1919" data-end="1974"><strong data-start="1919" data-end="1946">Predisposi&ccedil;&atilde;o gen&eacute;tica:</strong> hist&oacute;rico familiar forte.</p>\r\n</li>\r\n<li data-start="1975" data-end="2064">\r\n<p data-start="1977" data-end="2064"><strong data-start="1977" data-end="2013">Exposi&ccedil;&atilde;o a subst&acirc;ncias t&oacute;xicas:</strong> como agrot&oacute;xicos, poeiras industriais e radia&ccedil;&otilde;es.</p>\r\n</li>\r\n</ul>\r\n<p data-start="2066" data-end="2170">Importante: ter um fator de risco <strong data-start="2100" data-end="2117">n&atilde;o significa</strong> desenvolver c&acirc;ncer &mdash; apenas aumenta a probabilidade.</p>\r\n<hr data-start="2172" data-end="2175">\r\n<h2 data-start="2177" data-end="2204">📌 <strong data-start="2183" data-end="2202">Sintomas comuns</strong></h2>\r\n<p data-start="2205" data-end="2292">Os sintomas variam conforme o tipo de c&acirc;ncer, mas alguns sinais gerais merecem aten&ccedil;&atilde;o:</p>\r\n<ul data-start="2294" data-end="2471">\r\n<li data-start="2294" data-end="2323">\r\n<p data-start="2296" data-end="2323">Perda de peso inexplicada</p>\r\n</li>\r\n<li data-start="2324" data-end="2344">\r\n<p data-start="2326" data-end="2344">Fadiga constante</p>\r\n</li>\r\n<li data-start="2345" data-end="2367">\r\n<p data-start="2347" data-end="2367">Altera&ccedil;&otilde;es na pele</p>\r\n</li>\r\n<li data-start="2368" data-end="2387">\r\n<p data-start="2370" data-end="2387">Dor persistente</p>\r\n</li>\r\n<li data-start="2388" data-end="2411">\r\n<p data-start="2390" data-end="2411">Caro&ccedil;os ou incha&ccedil;os</p>\r\n</li>\r\n<li data-start="2412" data-end="2445">\r\n<p data-start="2414" data-end="2445">Mudan&ccedil;as no h&aacute;bito intestinal</p>\r\n</li>\r\n<li data-start="2446" data-end="2471">\r\n<p data-start="2448" data-end="2471">Sangramentos incomuns</p>\r\n</li>\r\n</ul>\r\n<p data-start="2473" data-end="2548">O ideal &eacute; buscar orienta&ccedil;&atilde;o m&eacute;dica ao notar mudan&ccedil;as persistentes no corpo.</p>\r\n<hr data-start="2550" data-end="2553">\r\n<h2 data-start="2555" data-end="2610">📌 <strong data-start="2561" data-end="2610">Diagn&oacute;stico e import&acirc;ncia da detec&ccedil;&atilde;o precoce</strong></h2>\r\n<p data-start="2612" data-end="2693">Detectar o c&acirc;ncer cedo <strong data-start="2635" data-end="2660">aumenta drasticamente</strong> as chances de cura. Exames como:</p>\r\n<ul data-start="2695" data-end="2791">\r\n<li data-start="2695" data-end="2709">\r\n<p data-start="2697" data-end="2709">Mamografia</p>\r\n</li>\r\n<li data-start="2710" data-end="2726">\r\n<p data-start="2712" data-end="2726">Colonoscopia</p>\r\n</li>\r\n<li data-start="2727" data-end="2742">\r\n<p data-start="2729" data-end="2742">Papanicolau</p>\r\n</li>\r\n<li data-start="2743" data-end="2750">\r\n<p data-start="2745" data-end="2750">PSA</p>\r\n</li>\r\n<li data-start="2751" data-end="2765">\r\n<p data-start="2753" data-end="2765">Tomografia</p>\r\n</li>\r\n<li data-start="2766" data-end="2791">\r\n<p data-start="2768" data-end="2791">Bi&oacute;psias direcionadas</p>\r\n</li>\r\n</ul>\r\n<p data-start="2793" data-end="2903">permitem identificar tumores ainda em est&aacute;gio inicial, quando as taxas de tratamento bem-sucedido s&atilde;o maiores.</p>\r\n<hr data-start="2905" data-end="2908">\r\n<h2 data-start="2910" data-end="2940">📌 <strong data-start="2916" data-end="2940">Op&ccedil;&otilde;es de tratamento</strong></h2>\r\n<p data-start="2942" data-end="2999">A medicina atual disp&otilde;e de diversos m&eacute;todos terap&ecirc;uticos:</p>\r\n<h3 data-start="3001" data-end="3022"><strong data-start="3005" data-end="3020">1. Cirurgia</strong></h3>\r\n<p data-start="3023" data-end="3104">Remove tumores localizados e &eacute; uma das formas mais eficazes em est&aacute;gios iniciais.</p>\r\n<h3 data-start="3106" data-end="3132"><strong data-start="3110" data-end="3130">2. Quimioterapia</strong></h3>\r\n<p data-start="3133" data-end="3209">Uso de medicamentos que atacam c&eacute;lulas cancer&iacute;genas em r&aacute;pida multiplica&ccedil;&atilde;o.</p>\r\n<h3 data-start="3211" data-end="3236"><strong data-start="3215" data-end="3234">3. Radioterapia</strong></h3>\r\n<p data-start="3237" data-end="3300">Feixes de radia&ccedil;&atilde;o destroem c&eacute;lulas tumorais com alta precis&atilde;o.</p>\r\n<h3 data-start="3302" data-end="3327"><strong data-start="3306" data-end="3325">4. Imunoterapia</strong></h3>\r\n<p data-start="3328" data-end="3445">Estimula o sistema imunol&oacute;gico do paciente a combater o c&acirc;ncer &mdash; uma das &aacute;reas mais promissoras da oncologia moderna.</p>\r\n<h3 data-start="3447" data-end="3473"><strong data-start="3451" data-end="3471">5. Terapias alvo</strong></h3>\r\n<p data-start="3474" data-end="3567">Medicamentos que atacam muta&ccedil;&otilde;es espec&iacute;ficas no tumor, oferecendo tratamentos personalizados.</p>\r\n<h3 data-start="3569" data-end="3600"><strong data-start="3573" data-end="3598">6. Terapias hormonais</strong></h3>\r\n<p data-start="3601" data-end="3686">Indicadas para c&acirc;nceres que dependem de horm&ocirc;nios para crescer, como mama e pr&oacute;stata.</p>\r\n<p data-start="3688" data-end="3794">A escolha do tratamento depende do tipo de c&acirc;ncer, est&aacute;gio, idade do paciente e condi&ccedil;&otilde;es gerais de sa&uacute;de.</p>\r\n<hr data-start="3796" data-end="3799">\r\n<h2 data-start="3801" data-end="3840">📌 <strong data-start="3807" data-end="3840">O futuro do combate ao c&acirc;ncer</strong></h2>\r\n<p data-start="3842" data-end="3884">A medicina caminha para um cen&aacute;rio em que:</p>\r\n<ul data-start="3886" data-end="4182">\r\n<li data-start="3886" data-end="3960">\r\n<p data-start="3888" data-end="3960">Tumores s&atilde;o identificados por <strong data-start="3918" data-end="3958">exames de sangue (bi&oacute;psias l&iacute;quidas)</strong></p>\r\n</li>\r\n<li data-start="3961" data-end="4012">\r\n<p data-start="3963" data-end="4012">Tratamentos s&atilde;o <strong data-start="3979" data-end="4010">personalizados por gen&eacute;tica</strong></p>\r\n</li>\r\n<li data-start="4013" data-end="4055">\r\n<p data-start="4015" data-end="4055">A imunoterapia se torna mais acess&iacute;vel</p>\r\n</li>\r\n<li data-start="4056" data-end="4100">\r\n<p data-start="4058" data-end="4100">A IA auxilia no diagn&oacute;stico ultrarr&aacute;pido</p>\r\n</li>\r\n<li data-start="4101" data-end="4182">\r\n<p data-start="4103" data-end="4182">O c&acirc;ncer se transforma, cada vez mais, em uma <strong data-start="4149" data-end="4182">doen&ccedil;a trat&aacute;vel e control&aacute;vel</strong></p>\r\n</li>\r\n</ul>\r\n<p data-start="4184" data-end="4319">Embora ainda seja um grande desafio global, a combina&ccedil;&atilde;o de ci&ecirc;ncia, tecnologia e preven&ccedil;&atilde;o tem aberto caminhos muito mais promissores.</p>', '/image/artigos/1764536518052-9805940.png', NULL, 'cancer-entendendo-a-doenca-prevencao-e-caminhos-para-o-futuro', 'câncer, oncologia, tumores, prevenção, tratamento, saúde, diagnóstico precoce, quimioterapia, imunoterapia, fatores de risco', NULL, 'Saúde e Bem-Estar', NULL, 'rascunho', NULL, '2025-11-30 21:02:04', '2025-11-30 21:02:04', 0, 0, 0, 0, 0, NULL);

-- Copiando estrutura para tabela hotel.avaliacao_paciente
CREATE TABLE IF NOT EXISTS `avaliacao_paciente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `nota` int NOT NULL,
  `comentario` text,
  `data_avaliacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_paciente_id` (`paciente_id`),
  CONSTRAINT `fk_paciente_id` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`paciente_id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacao_paciente_chk_1` CHECK ((`nota` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.avaliacao_paciente: ~2 rows (aproximadamente)
DELETE FROM `avaliacao_paciente`;
INSERT INTO `avaliacao_paciente` (`id`, `paciente_id`, `nota`, `comentario`, `data_avaliacao`) VALUES
	(8, 8, 4, 'legal', '2025-11-24 20:32:11'),
	(9, 8, 4, 'joia', '2025-11-24 20:43:58'),
	(10, 8, 5, 'amei', '2025-11-24 20:47:34');

-- Copiando estrutura para tabela hotel.doacao
CREATE TABLE IF NOT EXISTS `doacao` (
  `doacao_id` int NOT NULL AUTO_INCREMENT,
  `doador_id` int NOT NULL,
  `doacao_tipo` enum('Financeira','Produto','Alimento') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `doacao_valor` decimal(12,2) DEFAULT NULL,
  `doacao_metodo_pagamento` enum('Pix','Boleto','Cartão de Crédito','Depósito Bancário','Outro') DEFAULT NULL,
  `doacao_comprovante` varchar(255) DEFAULT NULL,
  `doacao_categoria_item` varchar(100) DEFAULT NULL,
  `doacao_quantidade` int DEFAULT NULL,
  `doacao_unidade` varchar(50) DEFAULT NULL,
  `doacao_status` enum('Pendente','Aprovada','Recusada') DEFAULT 'Pendente',
  `doacao_data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `doacao_destino` varchar(100) DEFAULT NULL,
  `doacao_recorrencia` enum('Única','Mensal','Trimestral','Anual') DEFAULT 'Única',
  `doacao_condicao` varchar(50) DEFAULT NULL,
  `servico_tipo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`doacao_id`),
  KEY `idx_doador_doacao` (`doador_id`),
  CONSTRAINT `fk_doacao_doador` FOREIGN KEY (`doador_id`) REFERENCES `doador` (`doador_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.doacao: ~3 rows (aproximadamente)
DELETE FROM `doacao`;
INSERT INTO `doacao` (`doacao_id`, `doador_id`, `doacao_tipo`, `doacao_valor`, `doacao_metodo_pagamento`, `doacao_comprovante`, `doacao_categoria_item`, `doacao_quantidade`, `doacao_unidade`, `doacao_status`, `doacao_data`, `doacao_destino`, `doacao_recorrencia`, `doacao_condicao`, `servico_tipo`) VALUES
	(11, 5, 'Financeira', 500.00, 'Pix', NULL, NULL, NULL, NULL, 'Pendente', '2025-11-22 16:38:52', 'Apoiar Pacientes', 'Única', NULL, NULL),
	(12, 5, 'Financeira', 1002.00, 'Pix', NULL, NULL, NULL, NULL, 'Pendente', '2024-01-22 17:05:15', 'Apoiar Pacientes', 'Única', NULL, NULL),
	(13, 5, 'Produto', NULL, NULL, NULL, 'móvel', 2, NULL, 'Pendente', '2025-11-22 17:05:21', 'Apoiar Pacientes', 'Única', 'Novo', NULL);

-- Copiando estrutura para tabela hotel.doador
CREATE TABLE IF NOT EXISTS `doador` (
  `doador_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `doador_tipo` enum('Pessoa Física','Pessoa Jurídica') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Pessoa Física',
  `doador_nome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `doador_cpf` varchar(14) DEFAULT NULL,
  `doador_rg` varchar(20) DEFAULT NULL,
  `doador_data_nascimento` date DEFAULT NULL,
  `doador_sexo` enum('Masculino','Feminino','Prefiro não informar','Outro') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `doador_telefone` varchar(20) DEFAULT NULL,
  `doador_logradouro` varchar(255) DEFAULT NULL,
  `doador_numero` varchar(10) DEFAULT NULL,
  `doador_complemento` varchar(50) DEFAULT NULL,
  `doador_bairro` varchar(100) DEFAULT NULL,
  `doador_cidade` varchar(100) DEFAULT NULL,
  `doador_estado` varchar(50) DEFAULT NULL,
  `doador_cep` varchar(15) DEFAULT NULL,
  `doador_nome_empresa` varchar(255) DEFAULT NULL,
  `doador_area_atuacao_empresa` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `doador_cnpj` varchar(18) DEFAULT NULL,
  `doador_telefone_empresa` varchar(15) DEFAULT NULL,
  `doador_representante` varchar(150) DEFAULT NULL,
  `doador_cpf_representante` varchar(15) DEFAULT NULL,
  `doador_qtd_total_doacoes` int DEFAULT '0',
  `doador_valor_total_doado` decimal(12,2) DEFAULT '0.00',
  `doador_valor_medio` decimal(10,2) DEFAULT NULL,
  `doador_data_ultima_doacao` date DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.doador: ~1 rows (aproximadamente)
DELETE FROM `doador`;
INSERT INTO `doador` (`doador_id`, `usuario_id`, `doador_tipo`, `doador_nome`, `doador_cpf`, `doador_rg`, `doador_data_nascimento`, `doador_sexo`, `doador_telefone`, `doador_logradouro`, `doador_numero`, `doador_complemento`, `doador_bairro`, `doador_cidade`, `doador_estado`, `doador_cep`, `doador_nome_empresa`, `doador_area_atuacao_empresa`, `doador_cnpj`, `doador_telefone_empresa`, `doador_representante`, `doador_cpf_representante`, `doador_qtd_total_doacoes`, `doador_valor_total_doado`, `doador_valor_medio`, `doador_data_ultima_doacao`, `doador_documento_comprovante`, `doador_documento_identidade`, `doador_documento_cnpj`, `doador_data_cadastro`, `doador_verificado`, `doador_aprovado_admin`, `doador_observacoes`, `doador_observacoes_internas`) VALUES
	(5, 48, 'Pessoa Jurídica', NULL, NULL, NULL, NULL, NULL, NULL, 'avenida um ', '2', '2', 'portal', 'São Paulo', 'SP', '07790852', 'Doacoes', 'ccvvj', '866026000', '45630306809', 'cvcvhvhe', '9652521307', 0, 0.00, NULL, NULL, NULL, NULL, NULL, '2025-11-21 20:59:37', 0, 0, NULL, NULL);

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
  `paciente_data_nascimento` date DEFAULT NULL,
  `paciente_sexo` enum('Masculino','Feminino','Outro') DEFAULT NULL,
  `paciente_estado_civil` enum('Solteiro','Casado','Divorciado','Viúvo','Outro') DEFAULT NULL,
  `paciente_profissao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paciente_nacionalidade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Brasileira',
  `paciente_tipo_sanguineo` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paciente_altura` decimal(4,2) DEFAULT NULL,
  `paciente_peso` decimal(5,2) DEFAULT NULL,
  `paciente_telefone` varchar(20) DEFAULT NULL,
  `paciente_logradouro` varchar(255) DEFAULT NULL,
  `paciente_numero` varchar(10) DEFAULT NULL,
  `paciente_complemento` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `paciente_bairro` varchar(100) DEFAULT NULL,
  `paciente_cidade` varchar(100) DEFAULT NULL,
  `paciente_estado` varchar(50) DEFAULT NULL,
  `paciente_cep` varchar(10) DEFAULT NULL,
  `paciente_contato_emergencia_1_nome` varchar(255) NOT NULL,
  `paciente_contato_emergencia_1_parentesco` varchar(100) NOT NULL,
  `paciente_contato_emergencia_1_telefone` varchar(20) NOT NULL,
  `paciente_contato_emergencia_2_nome` varchar(255) DEFAULT NULL,
  `paciente_contato_emergencia_2_parentesco` varchar(100) DEFAULT NULL,
  `paciente_contato_emergencia_2_telefone` varchar(20) DEFAULT NULL,
  `paciente_responsavel_legal_nome` varchar(255) DEFAULT NULL,
  `paciente_responsavel_legal_parentesco` varchar(100) DEFAULT NULL,
  `paciente_responsavel_legal_telefone` varchar(20) DEFAULT NULL,
  `paciente_centro_tratamento_nome` varchar(255) DEFAULT NULL,
  `paciente_medico_assistente_nome` varchar(255) DEFAULT NULL,
  `paciente_diagnostico` text,
  `paciente_fase_tratamento` varchar(100) DEFAULT NULL,
  `paciente_tipo_tratamento` varchar(100) DEFAULT NULL,
  `paciente_tempo_tratamento` varchar(100) DEFAULT NULL,
  `paciente_data_ultima_sessao` date DEFAULT NULL,
  `paciente_historico_medico_resumido` text,
  `paciente_alergias_risco` text,
  `paciente_medicamentos_uso_essenciais` text,
  `paciente_vulnerabilidade_imunossupressao` tinyint(1) DEFAULT '0',
  `paciente_restricoes_alimentares` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `paciente_restricoes_mobilidade` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.paciente: ~3 rows (aproximadamente)
DELETE FROM `paciente`;
INSERT INTO `paciente` (`paciente_id`, `usuario_id`, `paciente_email`, `paciente_nome`, `paciente_cpf`, `paciente_rg`, `paciente_data_nascimento`, `paciente_sexo`, `paciente_estado_civil`, `paciente_profissao`, `paciente_nacionalidade`, `paciente_tipo_sanguineo`, `paciente_altura`, `paciente_peso`, `paciente_telefone`, `paciente_logradouro`, `paciente_numero`, `paciente_complemento`, `paciente_bairro`, `paciente_cidade`, `paciente_estado`, `paciente_cep`, `paciente_contato_emergencia_1_nome`, `paciente_contato_emergencia_1_parentesco`, `paciente_contato_emergencia_1_telefone`, `paciente_contato_emergencia_2_nome`, `paciente_contato_emergencia_2_parentesco`, `paciente_contato_emergencia_2_telefone`, `paciente_responsavel_legal_nome`, `paciente_responsavel_legal_parentesco`, `paciente_responsavel_legal_telefone`, `paciente_centro_tratamento_nome`, `paciente_medico_assistente_nome`, `paciente_diagnostico`, `paciente_fase_tratamento`, `paciente_tipo_tratamento`, `paciente_tempo_tratamento`, `paciente_data_ultima_sessao`, `paciente_historico_medico_resumido`, `paciente_alergias_risco`, `paciente_medicamentos_uso_essenciais`, `paciente_vulnerabilidade_imunossupressao`, `paciente_restricoes_alimentares`, `paciente_restricoes_mobilidade`, `paciente_preferencia_horario_refeicao`, `paciente_observacoes_enfermagem`, `paciente_observacoes_gerais`) VALUES
	(6, 43, 'paciente@gmail.com', 'paciente', '3685976351263', '963852741', '2025-11-19', 'Feminino', 'Casado', 'professora', 'brasileira', 'AB+', 1.70, 70.00, '11963852741', 'Avenida Um', '133', NULL, 'Portal', 'Cajamar', 'SP', '05690630', 'contato1', 'mãe', '11963852741', 'contato2', 'pai', '11963852741', 'responsável', 'mãe', '11963852741', 'Sírio Libanês', 'médico', 'nenhum', '5', 'quimioterapia', '4 anos', '2025-11-04', 'nenhum', 'nenhum', 'nenhum', 1, 'nenhum', 'nenhum', 'Tarde', 'nenhum', 'nenhum'),
	(7, 44, 'teste@gmail.com', 'teste', '75395165425', '9638745632', '2001-02-21', 'Feminino', 'Casado', 'professor', 'brasileira', 'AB+', 1.70, 70.00, '11963852741', 'Avenida Um', '133', NULL, 'Portal', 'Cajamar', 'SP', '05690630', 'contato1', 'mãe', '11963852741', 'contato2', 'pai', '11963852741', 'responsável', 'mãe', '11963852741', 'Sírio Libanês', 'médico', '', '4', 'quimioterapia', '4 anos', '2025-11-07', '', '', '', 0, '', '', 'Indiferente', '', ''),
	(8, 45, 'joao.silva@email.com', 'João Silva', '98653212495', '356752362', '1980-01-15', 'Masculino', 'Casado', 'arquiteto', 'brasileira', 'B+', 1.75, 70.00, '11975632654', 'Rua das Flores', '123', 'bloco 1', 'Centro', 'São Paulo', 'SP', '035698623', 'Maria Silva', 'Esposa', '11963852653', 'Pedro Silva', 'Filho', '11945685230', 'Maria Silva', 'Esposa', '11963852653', 'Hospital Oncológico ABC', 'Dr. Carlos Mendes', 'Câncer de garganta não pequenas células, estágio II, adenocarcinoma.', 'Tratamento ativo', 'Quimioterapia combinada com radioterapia', '6 meses (iniciado em abril de 2023)', '2023-10-01', 'Paciente com histórico de tabagismo por 20 anos (parou em 2020). Diagnosticado em março de 2023 após sintomas de tosse persistente e perda de peso. Sem outras comorbidades significativas.', 'Alérgico a penicilina (reação cutânea). Risco de infecções devido ao tratamento oncológico.', 'Analgésicos (paracetamol), antieméticos (ondansetrona), suplementos vitamínicos.', 1, 'Dieta leve, evitar alimentos ácidos e picantes para reduzir náuseas. Preferência por alimentos moles e fáceis de digerir.\n', 'Mobilidade reduzida devido à fadiga e fraqueza causadas pelo tratamento. Recomendado uso de cadeira de rodas para longas distâncias.', 'Indiferente', 'Monitorar sinais vitais diariamente. Observar sinais de infecção (febre, calafrios). Administrar medicações conforme prescrito. Avaliar nível de dor e fadiga.', 'Paciente motivado e cooperativo. Família apoiadora e presente. Recomendado acompanhamento psicológico para suporte emocional. Próxima consulta em 15 dias.');

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.pergunta: ~2 rows (aproximadamente)
DELETE FROM `pergunta`;
INSERT INTO `pergunta` (`pergunta_id`, `usuario_id`, `pergunta_titulo`, `pergunta_conteudo`, `pergunta_categoria`, `pergunta_tags`, `pergunta_status`, `pergunta_destacada`, `pergunta_visualizacoes`, `pergunta_curtidas`, `pergunta_qtd_respostas`, `pergunta_aprovada_admin`, `pergunta_data_criacao`, `pergunta_data_atualizacao`, `pergunta_data_ultima_resposta`, `pergunta_editada`, `pergunta_editada_por`, `pergunta_deletada`, `pergunta_ip_criacao`, `pergunta_observacoes`, `pergunta_observacoes_internas`) VALUES
	(10, 26, 'Reservas', 'aaa', NULL, NULL, 'publicada', 0, 0, 0, 0, 0, '2025-11-29 17:24:33', '2025-11-29 17:24:33', NULL, 0, NULL, 0, '::1', NULL, NULL),
	(11, 43, 'a', 'a', NULL, NULL, 'publicada', 0, 0, 0, 0, 0, '2025-11-29 17:25:54', '2025-11-29 17:25:54', NULL, 0, NULL, 0, '::1', NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Detalhes dos quartos físicos do hotel';

-- Copiando dados para a tabela hotel.quarto: ~14 rows (aproximadamente)
DELETE FROM `quarto`;
INSERT INTO `quarto` (`quarto_id`, `tipo_quarto_id`, `quarto_numero`, `quarto_andar`, `quarto_status`, `quarto_observacoes`, `quarto_data_criacao`, `quarto_data_atualizacao`) VALUES
	(6, 6, '101', '1º Andar', 'reservado', 'Vista para o jardim, próximo à rampa de acesso', '2025-11-13 19:22:43', '2025-11-13 23:55:45'),
	(7, 6, '102', '1º Andar', 'reservado', 'Próximo à enfermagem', '2025-11-13 19:22:43', '2025-11-17 23:18:38'),
	(8, 6, '201', '2º Andar', 'ocupado', 'Quarto silencioso', '2025-11-13 19:22:43', '2025-11-13 19:22:43'),
	(9, 7, '205', '2º Andar', 'ocupado', 'Vista para a cidade', '2025-11-13 19:22:43', '2025-11-14 18:02:55'),
	(10, 7, '206', '2º Andar', 'em_limpeza', 'Quarto recém-liberado', '2025-11-13 19:22:43', '2025-11-13 19:22:43'),
	(11, 7, '301', '3º Andar', 'reservado', NULL, '2025-11-13 19:22:43', '2025-11-15 01:31:59'),
	(12, 8, '305', '3º Andar', 'reservado', 'Suíte de canto, mais espaçosa', '2025-11-13 19:22:43', '2025-11-17 21:15:55'),
	(13, 8, '306', '3º Andar', 'reservado', 'Manutenção no ar-condicionado', '2025-11-13 19:22:43', '2025-11-18 23:07:09'),
	(14, 8, '401', '4º Andar', 'reservado', 'Com cozinha compacta completa', '2025-11-13 19:22:43', '2025-11-13 19:22:43'),
	(15, 9, '103', '1º Andar', 'reservado', 'Acessibilidade total, mais perto do elevador', '2025-11-13 19:22:43', '2025-11-17 22:24:36'),
	(16, 9, '104', '1º Andar', 'ocupado', 'Próximo à saída de emergência', '2025-11-13 19:22:43', '2025-11-13 19:22:43'),
	(17, 10, '405', '4º Andar', 'reservado', 'Equipamentos de monitoramento instalados', '2025-11-13 19:22:43', '2025-11-18 20:39:45'),
	(18, 10, '406', '4º Andar', 'ocupado', 'Com isolamento acústico', '2025-11-13 19:22:43', '2025-11-14 18:02:38'),
	(19, 10, '407', '4º Andar', 'ocupado', 'Próximo à sala da equipe médica', '2025-11-13 19:22:43', '2025-11-13 19:22:43');

-- Copiando estrutura para tabela hotel.quarto_fotos
CREATE TABLE IF NOT EXISTS `quarto_fotos` (
  `foto_id` int NOT NULL AUTO_INCREMENT,
  `tipo_quarto_id` int NOT NULL,
  `foto_caminho` varchar(255) NOT NULL,
  `foto_ordem` int DEFAULT '1',
  PRIMARY KEY (`foto_id`),
  KEY `quarto_id` (`tipo_quarto_id`) USING BTREE,
  CONSTRAINT `FK_quarto_fotos_tipo_quarto` FOREIGN KEY (`tipo_quarto_id`) REFERENCES `tipo_quarto` (`tipo_quarto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.quarto_fotos: ~15 rows (aproximadamente)
DELETE FROM `quarto_fotos`;
INSERT INTO `quarto_fotos` (`foto_id`, `tipo_quarto_id`, `foto_caminho`, `foto_ordem`) VALUES
	(11, 6, '/img/quartos/individual_adaptado_1.jpg', 1),
	(12, 6, '/img/quartos/individual_adaptado_2.jpg', 2),
	(13, 6, '/img/quartos/individual_adaptado_3.jpg', 3),
	(14, 7, '/img/quartos/duplo_simples_1.jpg', 1),
	(15, 7, '/img/quartos/duplo_simples_2.jpg', 2),
	(16, 7, '/img/quartos/duplo_simples_3.jpg', 3),
	(17, 8, '/img/quartos/suite_familiar_1.jpg', 1),
	(18, 8, '/img/quartos/suite_familiar_2.jpg', 2),
	(19, 8, '/img/quartos/suite_familiar_3.jpg', 3),
	(20, 9, '/img/quartos/quarto_para_cadeirantes_1.jpg', 1),
	(21, 9, '/img/quartos/quarto_para_cadeirantes_2.jpg', 2),
	(22, 9, '/img/quartos/quarto_para_cadeirantes_3.jpg', 3),
	(23, 10, '/img/quartos/quarto_com_cuidados_intensivos_1.jpg', 1),
	(24, 10, '/img/quartos/quarto_com_cuidados_intensivos_2.jpg', 2),
	(25, 10, '/img/quartos/quarto_com_cuidados_intensivos_3.jpg', 3);

-- Copiando estrutura para tabela hotel.reserva
CREATE TABLE IF NOT EXISTS `reserva` (
  `reserva_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `acompanhante_id` int DEFAULT NULL,
  `quarto_id` int NOT NULL,
  `reserva_data_checkin_previsto` datetime NOT NULL COMMENT 'Data e hora prevista para o check-in',
  `reserva_data_checkout_previsto` datetime NOT NULL COMMENT 'Data e hora prevista para o check-out',
  `reserva_data_checkin_real` datetime DEFAULT NULL COMMENT 'Data e hora real do check-in (preenchido na hora)',
  `reserva_data_checkout_real` datetime DEFAULT NULL,
  `reserva_num_hospedes` int NOT NULL DEFAULT '1' COMMENT 'Total de pessoas (paciente + acompanhantes)',
  `reserva_duracao_dias` int DEFAULT NULL COMMENT 'Pode ser calculado por trigger ou na aplicação',
  `reserva_status` enum('pendente','confirmada','em_andamento','concluida','cancelada','no-show') DEFAULT 'pendente',
  `reserva_motivo` text COMMENT 'Ex.: Tratamento quimioterapia, Pós-operatório',
  `reserva_necessidades_especiais` text COMMENT 'Necessidades específicas para a estadia',
  `reserva_admin_aprovou` tinyint(1) DEFAULT '0' COMMENT 'Se a reserva foi revisada e aprovada por um admin',
  `reserva_data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reserva_data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reserva_observacoes` text,
  `reserva_observacoes_internas` text,
  PRIMARY KEY (`reserva_id`),
  KEY `fk_reserva_paciente` (`paciente_id`),
  KEY `fk_reserva_acompanhante` (`acompanhante_id`),
  KEY `fk_reserva_quarto` (`quarto_id`),
  CONSTRAINT `fk_reserva_acompanhante` FOREIGN KEY (`acompanhante_id`) REFERENCES `acompanhante` (`acompanhante_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reserva_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`paciente_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reserva_quarto` FOREIGN KEY (`quarto_id`) REFERENCES `quarto` (`quarto_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro central das reservas';

-- Copiando dados para a tabela hotel.reserva: ~7 rows (aproximadamente)
DELETE FROM `reserva`;
INSERT INTO `reserva` (`reserva_id`, `paciente_id`, `acompanhante_id`, `quarto_id`, `reserva_data_checkin_previsto`, `reserva_data_checkout_previsto`, `reserva_data_checkin_real`, `reserva_data_checkout_real`, `reserva_num_hospedes`, `reserva_duracao_dias`, `reserva_status`, `reserva_motivo`, `reserva_necessidades_especiais`, `reserva_admin_aprovou`, `reserva_data_criacao`, `reserva_data_atualizacao`, `reserva_observacoes`, `reserva_observacoes_internas`) VALUES
	(17, 6, NULL, 6, '2025-11-13 06:00:00', '2025-11-28 06:00:00', NULL, NULL, 1, NULL, 'concluida', '', NULL, 0, '2025-11-13 23:55:44', '2025-11-22 02:21:07', NULL, NULL),
	(18, 6, NULL, 11, '2025-11-19 06:00:00', '2025-11-28 06:00:00', NULL, NULL, 1, NULL, 'concluida', '', NULL, 0, '2025-11-15 01:31:58', '2025-11-22 02:20:53', NULL, NULL),
	(19, 6, NULL, 12, '2025-11-18 03:00:00', '2025-11-29 03:00:00', NULL, NULL, 1, NULL, 'concluida', 'tratamento', NULL, 0, '2025-11-17 21:15:54', '2025-11-19 22:59:39', NULL, NULL),
	(20, 6, NULL, 15, '2025-11-18 03:00:00', '2025-11-29 03:00:00', NULL, NULL, 1, NULL, 'cancelada', 'tratamento', NULL, 0, '2025-11-17 22:24:36', '2025-11-19 22:59:20', NULL, NULL),
	(21, 7, NULL, 7, '2025-11-26 03:00:00', '2025-11-29 03:00:00', NULL, NULL, 1, NULL, 'pendente', 'asa', NULL, 0, '2025-11-17 23:18:38', '2025-11-17 23:18:38', NULL, NULL),
	(22, 8, NULL, 17, '2025-11-20 03:00:00', '2025-11-30 03:00:00', NULL, NULL, 1, NULL, 'confirmada', 'continuação do tratamento', NULL, 0, '2025-11-18 20:39:45', '2025-11-19 22:47:27', NULL, NULL),
	(23, 8, NULL, 13, '2025-11-19 03:00:00', '2025-11-28 03:00:00', NULL, NULL, 1, NULL, 'confirmada', NULL, NULL, 0, '2025-11-18 23:07:09', '2025-11-19 22:47:30', NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.resposta: ~1 rows (aproximadamente)
DELETE FROM `resposta`;
INSERT INTO `resposta` (`resposta_id`, `pergunta_id`, `usuario_id`, `resposta_conteudo`, `resposta_pai_id`, `resposta_status`, `resposta_curtidas`, `resposta_visualizacoes`, `resposta_aprovada_admin`, `resposta_data_criacao`, `resposta_data_atualizacao`, `resposta_editada`, `resposta_editada_por`, `resposta_deletada`, `resposta_ip_criacao`, `resposta_observacoes`, `resposta_observacoes_internas`) VALUES
	(2, 10, 26, 'aaaa', NULL, 'publicada', 0, 0, 0, '2025-11-29 17:24:39', '2025-11-29 17:24:39', 0, NULL, 0, '::1', NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tipos de acomodação disponíveis no hotel';

-- Copiando dados para a tabela hotel.tipo_quarto: ~5 rows (aproximadamente)
DELETE FROM `tipo_quarto`;
INSERT INTO `tipo_quarto` (`tipo_quarto_id`, `tipo_quarto_nome`, `tipo_quarto_descricao`, `tipo_quarto_capacidade_pacientes`, `tipo_quarto_capacidade_acompanhantes`, `tipo_quarto_necessidades_especiais`, `tipo_quarto_status`, `tipo_quarto_data_criacao`, `tipo_quarto_data_atualizacao`, `tipo_quarto_observacoes`) VALUES
	(6, 'Individual Adaptado', 'Quarto individual projetado para pacientes oncológicos, com cama hospitalar ajustável, banheiro privativo, TV, frigobar e área para acompanhante. Inclui facilidades como tomadas extras para equipamentos médicos e iluminação suave.', 1, 1, 'Adaptações para cadeirantes: portas largas, barras de apoio no banheiro, chuveiro acessível e piso antiderrapante. Suporte para oxigênio e monitores cardíacos.', 'ativo', '2025-11-13 19:01:12', '2025-11-13 19:01:12', 'Ideal para pacientes em tratamento ativo, com foco em conforto e privacidade. Capacidade para um acompanhante para suporte emocional.'),
	(7, 'Duplo Simples', 'Quarto com duas camas individuais, adequado para pacientes que preferem compartilhar espaço ou para um paciente com acompanhante residente. Inclui banheiro compartilhado, TV e área de estar básica.', 1, 1, 'Adaptações básicas: barras de apoio no banheiro e piso antiderrapante. Não inclui equipamentos médicos específicos, mas pode ser adaptado.', 'ativo', '2025-11-13 19:01:12', '2025-11-14 18:32:54', 'Econômico e social, permitindo interação entre pacientes ou com acompanhantes. Capacidade máxima de 2 pacientes ou 1 paciente + 1 acompanhante.'),
	(8, 'Suíte Familiar', 'Suíte espaçosa com cama king-size ou duas camas, sala de estar separada, cozinha compacta e banheiro duplo. Projetada para famílias, com espaço para múltiplos acompanhantes.', 1, 2, 'Adaptações para acessibilidade: elevador para camas, barras de apoio e espaço amplo para manobras de cadeira de rodas. Inclui tomadas para equipamentos médicos.', 'ativo', '2025-11-13 19:01:12', '2025-11-14 18:33:23', 'Perfeita para pacientes com famílias grandes, oferecendo privacidade e comodidades domésticas. Suporte para até 3 acompanhantes.'),
	(9, 'Quarto para Cadeirantes', 'Quarto individual totalmente acessível, com cama hospitalar, banheiro adaptado e espaço amplo para manobras. Inclui rampas, barras de apoio e equipamentos de emergência.', 1, 1, 'Especialmente adaptado para cadeirantes: portas automáticas, chuveiro com assento, espelhos baixos e alertas visuais. Suporte para ventiladores e bombas de infusão.', 'ativo', '2025-11-13 19:01:12', '2025-11-14 18:33:02', 'Focado em mobilidade reduzida, garantindo segurança e independência. Capacidade para um acompanhante treinado.'),
	(10, 'Quarto com Cuidados Intensivos', 'Quarto equipado para pacientes com necessidades médicas avançadas, incluindo cama hospitalar com controles, monitores vitais, oxigênio e suporte para cateteres. Banheiro acessível e área para equipe médica.', 1, 1, 'Adaptações médicas: tomadas para equipamentos pesados, sistema de chamada de emergência e isolamento acústico. Inclui recursos para pacientes com imunossupressão.', 'ativo', '2025-11-13 19:01:12', '2025-11-13 19:01:12', 'Reservado para pacientes em estágios críticos do tratamento, com supervisão médica próxima. Capacidade limitada para acompanhantes devido a protocolos de saúde.');

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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.usuario: ~8 rows (aproximadamente)
DELETE FROM `usuario`;
INSERT INTO `usuario` (`usuario_id`, `usuario_email`, `usuario_senha`, `usuario_tipo`, `usuario_data_criacao`, `usuario_estado`, `usuario_ultimo_login`, `usuario_foto_perfil`) VALUES
	(26, 'admin@gmail.com', '$2b$10$LDsQserWeAQGEfUpat7R2eYhXFlO14WtwOu00uwAi91PCQB/XXfoa', 'admin', '2025-10-23 22:05:20', 'ativo', '2025-11-30 21:12:34', '/uploads/usuarios/padrao.png'),
	(41, 'voluntario@gmail.com', '$2b$10$pRMCCoTzoeOyPzY97BFrVe7DIskU8lvgKTHTKIjbKz4guHV8l0AL2', 'voluntario', '2025-11-13 16:32:00', 'ativo', '2025-11-18 16:47:47', '/uploads/usuarios/padrao.png'),
	(43, 'paciente@gmail.com', '$2b$10$zszYS2HEMzVO7mc5Yeza4uOBRNU7c3eKbdXe6wTJUp1ivlH5N5t0S', 'paciente', '2025-11-13 19:20:43', 'ativo', '2025-11-30 16:49:59', '/uploads/usuarios/padrao.png'),
	(44, 'teste@gmail.com', '$2b$10$Ec6r8jkNprK0gLBbIrdvNeDoFRbF5eBTo6gRoLnKDU608sdUbmTuG', 'acompanhante', '2025-11-17 16:16:09', 'ativo', '2025-11-22 17:58:29', '/uploads/usuarios/padrao.png'),
	(45, 'joao.silva@email.com', '$2b$10$2TCAFBsUaQNhf6VEpBVm4O56UN4ohu0M5sBQxQklOYvz29w6o0Z/2', 'paciente', '2025-11-18 17:32:52', 'ativo', '2025-11-24 20:43:50', '/uploads/usuarios/padrao.png'),
	(48, 'doador3@gmail.com', '$2b$10$8aTdnjmoTHa4i/SnGAHtBurdR3YjqJ/kD9IAkT/IWnq3HjZlCJWCO', 'doador', '2025-11-21 17:52:50', 'ativo', '2025-11-29 21:19:50', '/uploads/usuarios/padrao.png'),
	(53, 'acompanhante@gmail.com', '$2b$10$KNjWTFJIDMPXAkJIPdI0o.f.gd9PQndpkk98AcolMc2jqhM.ZMkc2', 'acompanhante', '2025-11-22 21:06:11', 'ativo', '2025-11-29 21:22:53', '/uploads/usuarios/padrao.png'),
	(54, 'teste2@gmail.com', '$2b$10$nbuXtY0IZe4v9IXycL6ii.kyDO9kWzVOTW64cT.qHyfE51pImlPcq', 'acompanhante', '2025-11-24 16:03:20', 'ativo', '2025-11-24 16:05:26', '/uploads/usuarios/padrao.png');

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela hotel.voluntario: ~0 rows (aproximadamente)
DELETE FROM `voluntario`;
INSERT INTO `voluntario` (`voluntario_id`, `usuario_id`, `voluntario_nome`, `voluntario_cpf`, `voluntario_rg`, `voluntario_data_nascimento`, `voluntario_sexo`, `voluntario_estado_civil`, `voluntario_telefone`, `voluntario_endereco`, `voluntario_cidade`, `voluntario_estado`, `voluntario_area_atuacao`, `voluntario_habilidades`, `voluntario_disponibilidade`, `voluntario_horarios_disponiveis`, `voluntario_experiencia_previa`, `voluntario_certificado`, `voluntario_data_cadastro`, `voluntario_verificado`, `voluntario_observacoes`) VALUES
	(3, 41, 'voluntario', '12345678942', '1234567890', '2025-11-26', 'Masculino', 'Solteiro(a)', '11963258741', 'avenida um', 'são paulo', 'SP', 'cuidados hospitalares', '', 'Parcial', '', '', 1, '2025-11-13 19:32:39', 0, '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
