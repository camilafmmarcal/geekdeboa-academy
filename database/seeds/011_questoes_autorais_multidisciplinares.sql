-- Geek de Boa Academy 2.0 | Projeto Integrado II
-- Seed 011: 42 questoes autorais, 3 por assunto, 5 alternativas cada
-- Compatibilidade: MySQL 8; dependencias seeds 001 e 002
-- Execucao reentrante: nao duplica questoes nem alternativas existentes
-- Revisar o conteudo pedagogico antes de uso avaliativo formal.
USE geekdeboa_academy;

DROP TEMPORARY TABLE IF EXISTS tmp_questoes_011;
DROP TEMPORARY TABLE IF EXISTS tmp_alternativas_011;
CREATE TEMPORARY TABLE tmp_questoes_011 (
  codigo VARCHAR(16) PRIMARY KEY,
  disciplina VARCHAR(120) NOT NULL,
  assunto VARCHAR(150) NOT NULL,
  dificuldade ENUM('FACIL','MEDIA','DIFICIL') NOT NULL,
  enunciado TEXT NOT NULL,
  comentario_gabarito TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TEMPORARY TABLE tmp_alternativas_011 (
  codigo VARCHAR(16) NOT NULL,
  letra CHAR(1) NOT NULL,
  texto TEXT NOT NULL,
  correta BOOLEAN NOT NULL,
  PRIMARY KEY(codigo, letra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO tmp_questoes_011 (codigo, disciplina, assunto, dificuldade, enunciado, comentario_gabarito) VALUES
('Q001', 'Programação', 'POO', 'FACIL', 'Em orientação a objetos, o que caracteriza a herança?', 'Herança permite que uma classe derivada reutilize e especialize características da classe base.'),
('Q002', 'Programação', 'POO', 'MEDIA', 'Em Java, qual situação exemplifica polimorfismo por sobrescrita?', 'A sobrescrita permite que a implementação executada dependa do tipo concreto do objeto.'),
('Q003', 'Programação', 'POO', 'MEDIA', 'Qual afirmação sobre uma classe abstrata em Java está correta?', 'Classes abstratas podem compartilhar implementação e definir contratos abstratos, sem instanciação direta.'),
('Q004', 'Programação', 'JavaScript', 'FACIL', 'Qual declaração cria uma variável cujo vínculo não pode ser reatribuído em JavaScript?', 'const impede reatribuição do vínculo; não torna imutável o conteúdo de objetos.'),
('Q005', 'Programação', 'JavaScript', 'MEDIA', 'Qual é o resultado da expressão JavaScript 2 === "2"?', 'O operador === compara valor e tipo, sem coerção de tipos como a realizada por ==.'),
('Q006', 'Programação', 'JavaScript', 'MEDIA', 'Qual método de array retorna um novo array com cada elemento transformado por uma função?', 'map constrói um novo array a partir da transformação de cada elemento.'),
('Q007', 'Programação', 'Estruturas de Dados', 'FACIL', 'Em uma pilha (stack), qual política de remoção é utilizada?', 'Uma pilha segue LIFO: o último elemento inserido é o primeiro removido.'),
('Q008', 'Programação', 'Estruturas de Dados', 'FACIL', 'Qual estrutura utiliza tipicamente a política FIFO?', 'Na fila, o primeiro elemento inserido é o primeiro a sair.'),
('Q009', 'Programação', 'Estruturas de Dados', 'MEDIA', 'Em uma tabela hash bem dimensionada, qual é a complexidade média esperada de uma busca por chave?', 'Em condições usuais, a busca por chave em uma tabela hash tem custo médio constante; colisões podem degradar o desempenho.'),
('Q010', 'Banco de Dados', 'Modelagem Entidade-Relacionamento', 'FACIL', 'Em um modelo entidade-relacionamento, o que representa a cardinalidade 1:N?', 'A cardinalidade 1:N indica que uma ocorrência de um lado pode relacionar-se a muitas do outro.'),
('Q011', 'Banco de Dados', 'Modelagem Entidade-Relacionamento', 'MEDIA', 'Qual recurso do banco relacional implementa a referência de uma linha à chave de outra tabela?', 'A chave estrangeira expressa o vínculo referencial entre tabelas.'),
('Q012', 'Banco de Dados', 'Modelagem Entidade-Relacionamento', 'MEDIA', 'Para registrar alunos matriculados em vários cursos, sendo cada curso frequentado por vários alunos, qual modelagem é adequada?', 'Relacionamentos N:N são normalmente implementados por tabela associativa que referencia ambas as entidades.'),
('Q013', 'Banco de Dados', 'SQL e Consultas', 'FACIL', 'Qual cláusula SQL é usada para filtrar linhas antes da agregação?', 'WHERE restringe linhas antes de operações de agrupamento e agregação.'),
('Q014', 'Banco de Dados', 'SQL e Consultas', 'MEDIA', 'Qual cláusula filtra grupos produzidos por GROUP BY?', 'HAVING aplica condições aos grupos após o agrupamento, frequentemente usando funções de agregação.'),
('Q015', 'Banco de Dados', 'SQL e Consultas', 'MEDIA', 'Em SQL, qual JOIN mantém todas as linhas da tabela da esquerda, mesmo sem correspondência à direita?', 'LEFT JOIN preserva as linhas da tabela à esquerda e usa NULL para dados sem correspondência do lado direito.'),
('Q016', 'Engenharia de Software', 'Requisitos de Software', 'FACIL', 'Qual alternativa é um requisito não funcional?', 'Tempo de resposta é um atributo de qualidade, portanto um requisito não funcional mensurável.'),
('Q017', 'Engenharia de Software', 'Requisitos de Software', 'MEDIA', 'Qual característica torna um requisito mais testável?', 'Um requisito testável define resultados observáveis e critérios claros para confirmar seu atendimento.'),
('Q018', 'Engenharia de Software', 'Requisitos de Software', 'MEDIA', 'Qual é uma finalidade da rastreabilidade de requisitos?', 'Rastreabilidade conecta cada requisito às fontes, artefatos de solução e evidências de verificação.'),
('Q019', 'Engenharia de Software', 'Diagramas UML', 'FACIL', 'Qual diagrama UML é mais indicado para apresentar classes, atributos, métodos e relacionamentos estáticos?', 'O diagrama de classes descreve a estrutura estática do sistema e seus relacionamentos.'),
('Q020', 'Engenharia de Software', 'Diagramas UML', 'MEDIA', 'Qual diagrama UML enfatiza a ordem temporal das mensagens trocadas entre objetos?', 'O diagrama de sequência apresenta interações e mensagens ao longo do tempo.'),
('Q021', 'Engenharia de Software', 'Diagramas UML', 'MEDIA', 'Em um diagrama de casos de uso, o ator representa:', 'Atores representam papéis externos que interagem com o sistema; podem ser pessoas ou outros sistemas.'),
('Q022', 'Redes de Computadores', 'TCP/IP', 'FACIL', 'Qual protocolo é utilizado para traduzir nomes de domínio em endereços IP?', 'DNS permite resolver nomes de domínio em registros, incluindo endereços IP.'),
('Q023', 'Redes de Computadores', 'TCP/IP', 'MEDIA', 'Em uma comunicação TCP, qual mecanismo ajuda a garantir a entrega ordenada dos dados?', 'TCP utiliza números de sequência, confirmações e retransmissões para proporcionar entrega confiável e ordenada.'),
('Q024', 'Redes de Computadores', 'TCP/IP', 'MEDIA', 'Qual afirmação diferencia UDP de TCP?', 'UDP não oferece por si só garantia de entrega, ordenação ou estabelecimento de conexão.'),
('Q025', 'Segurança da Informação', 'Autenticação e Autorização', 'FACIL', 'Qual é a diferença central entre autenticação e autorização?', 'Autenticação verifica quem acessa; autorização verifica o que essa identidade pode fazer.'),
('Q026', 'Segurança da Informação', 'Autenticação e Autorização', 'MEDIA', 'Qual prática caracteriza o princípio do menor privilégio?', 'O menor privilégio limita acessos às permissões indispensáveis para cada função.'),
('Q027', 'Segurança da Informação', 'Autenticação e Autorização', 'MEDIA', 'Qual combinação representa fatores distintos de autenticação multifator?', 'Senha é fator de conhecimento; um autenticador vinculado ao dispositivo pode fornecer fator de posse.'),
('Q028', 'Qualidade de Software', 'Testes Unitários', 'FACIL', 'Qual é o foco principal de um teste unitário?', 'Testes unitários verificam componentes ou unidades de comportamento, frequentemente isolando dependências.'),
('Q029', 'Qualidade de Software', 'Testes Unitários', 'MEDIA', 'Por que testes unitários devem ser determinísticos sempre que possível?', 'Determinismo facilita a reprodução de falhas e a confiança nos resultados.'),
('Q030', 'Qualidade de Software', 'Testes Unitários', 'MEDIA', 'Qual situação indica maior adequação a um teste de integração do que a um teste unitário isolado?', 'A comunicação real entre API e banco verifica a integração entre componentes, não apenas uma unidade isolada.'),
('Q031', 'Governança de TI', 'ITIL e COBIT', 'FACIL', 'Qual associação está correta?', 'ITIL oferece práticas de gestão de serviços; COBIT é um framework de governança e gestão de informação e tecnologia.'),
('Q032', 'Governança de TI', 'ITIL e COBIT', 'MEDIA', 'Qual é o objetivo principal do gerenciamento de incidentes em gestão de serviços?', 'O gerenciamento de incidentes busca restaurar o serviço; a investigação de causas subjacentes é foco do gerenciamento de problemas.'),
('Q033', 'Governança de TI', 'ITIL e COBIT', 'MEDIA', 'Qual indicador é apropriado para acompanhar disponibilidade de um serviço?', 'Disponibilidade expressa a proporção do período em que o serviço atende à condição operacional definida.'),
('Q034', 'Desenvolvimento Web', 'APIs REST', 'FACIL', 'Qual método HTTP é normalmente utilizado para consultar um recurso sem solicitar sua alteração?', 'GET é o método HTTP usual para recuperar representações de recursos.'),
('Q035', 'Desenvolvimento Web', 'APIs REST', 'MEDIA', 'Qual código HTTP é adequado quando um recurso solicitado por GET não foi encontrado?', 'HTTP 404 indica que o servidor não encontrou o recurso solicitado.'),
('Q036', 'Desenvolvimento Web', 'APIs REST', 'MEDIA', 'Qual é uma propriedade da operação PUT segundo a semântica HTTP?', 'PUT é idempotente: múltiplas requisições idênticas têm o mesmo efeito pretendido que uma única requisição.'),
('Q037', 'Desenvolvimento Web', 'React', 'FACIL', 'Em React, para que servem props?', 'Props são entradas recebidas por componentes, utilizadas para configurar seu comportamento e apresentação.'),
('Q038', 'Desenvolvimento Web', 'React', 'MEDIA', 'Qual Hook do React é utilizado para armazenar estado local de um componente funcional?', 'useState fornece um valor de estado e uma função para solicitar sua atualização.'),
('Q039', 'Desenvolvimento Web', 'React', 'MEDIA', 'Ao renderizar uma lista em React, qual é o papel de uma key estável?', 'Uma key estável permite ao React relacionar itens da lista entre renderizações, favorecendo reconciliação correta.'),
('Q040', 'Direito e Legislação', 'LGPD', 'FACIL', 'Na LGPD, qual conceito corresponde a dado pessoal?', 'A LGPD define dado pessoal como informação relacionada a pessoa natural identificada ou identificável.'),
('Q041', 'Direito e Legislação', 'LGPD', 'MEDIA', 'Qual é uma das bases legais previstas na LGPD para o tratamento de dados pessoais?', 'A execução de contrato ou de procedimentos preliminares a pedido do titular é base legal prevista na LGPD, respeitadas suas condições.'),
('Q042', 'Direito e Legislação', 'LGPD', 'MEDIA', 'Qual prática está mais alinhada ao princípio da necessidade da LGPD?', 'O princípio da necessidade limita o tratamento ao mínimo necessário para realização das finalidades informadas.');

INSERT INTO tmp_alternativas_011 (codigo, letra, texto, correta) VALUES
('Q001', 'A', 'Permitir que uma classe reutilize e especialize comportamentos de outra', 1),
('Q001', 'B', 'Executar diferentes métodos ao mesmo tempo', 0),
('Q001', 'C', 'Impedir a criação de objetos', 0),
('Q001', 'D', 'Tornar todos os atributos públicos', 0),
('Q001', 'E', 'Converter automaticamente classes em interfaces', 0),
('Q002', 'A', 'Dois atributos possuem o mesmo nome em classes distintas', 0),
('Q002', 'B', 'Uma subclasse redefine um método herdado e a chamada usa o comportamento do objeto concreto', 1),
('Q002', 'C', 'Um construtor recebe parâmetros opcionais', 0),
('Q002', 'D', 'Um método altera um campo privado diretamente', 0),
('Q002', 'E', 'Uma variável local substitui uma constante', 0),
('Q003', 'A', 'Pode ser instanciada diretamente com new', 0),
('Q003', 'B', 'Não pode declarar construtores', 0),
('Q003', 'C', 'Não pode conter métodos concretos', 0),
('Q003', 'D', 'Pode declarar métodos concretos e abstratos, mas não pode ser instanciada diretamente', 1),
('Q003', 'E', 'É equivalente a uma variável final', 0),
('Q004', 'A', 'var', 0),
('Q004', 'B', 'const', 1),
('Q004', 'C', 'let', 0),
('Q004', 'D', 'function', 0),
('Q004', 'E', 'new', 0),
('Q005', 'A', 'true, por coerção automática', 0),
('Q005', 'B', '2', 0),
('Q005', 'C', 'false, pois os tipos diferem', 1),
('Q005', 'D', 'undefined', 0),
('Q005', 'E', 'Uma exceção sempre é lançada', 0),
('Q006', 'A', 'filter', 0),
('Q006', 'B', 'push', 0),
('Q006', 'C', 'find', 0),
('Q006', 'D', 'forEach', 0),
('Q006', 'E', 'map', 1),
('Q007', 'A', 'FIFO', 0),
('Q007', 'B', 'LIFO', 1),
('Q007', 'C', 'Ordenação alfabética', 0),
('Q007', 'D', 'Acesso aleatório obrigatório', 0),
('Q007', 'E', 'Maior valor primeiro', 0),
('Q008', 'A', 'Fila', 1),
('Q008', 'B', 'Pilha', 0),
('Q008', 'C', 'Árvore binária', 0),
('Q008', 'D', 'Tabela hash', 0),
('Q008', 'E', 'Grafo direcionado', 0),
('Q009', 'A', 'O(n²)', 0),
('Q009', 'B', 'O(n log n)', 0),
('Q009', 'C', 'O(log n!)', 0),
('Q009', 'D', 'O(1)', 1),
('Q009', 'E', 'O(2^n)', 0),
('Q010', 'A', 'Uma entidade não pode se relacionar com outra', 0),
('Q010', 'B', 'Uma ocorrência de A pode estar relacionada a várias ocorrências de B', 1),
('Q010', 'C', 'Toda entidade possui exatamente uma chave composta', 0),
('Q010', 'D', 'Duas tabelas têm a mesma quantidade de linhas', 0),
('Q010', 'E', 'O relacionamento exige exclusão em cascata', 0),
('Q011', 'A', 'Índice de texto completo', 0),
('Q011', 'B', 'Visão materializada', 0),
('Q011', 'C', 'Chave estrangeira', 1),
('Q011', 'D', 'Trigger de auditoria', 0),
('Q011', 'E', 'Comentário da coluna', 0),
('Q012', 'A', 'Guardar todos os cursos em uma coluna de texto do aluno', 0),
('Q012', 'B', 'Duplicar os dados de cada aluno em toda tabela de cursos', 0),
('Q012', 'C', 'Criar somente a tabela alunos', 0),
('Q012', 'D', 'Impedir matrículas múltiplas', 0),
('Q012', 'E', 'Criar uma tabela associativa de matrículas com chaves para aluno e curso', 1),
('Q013', 'A', 'WHERE', 1),
('Q013', 'B', 'ORDER BY', 0),
('Q013', 'C', 'GROUP BY', 0),
('Q013', 'D', 'HAVING', 0),
('Q013', 'E', 'LIMIT', 0),
('Q014', 'A', 'LIMIT', 0),
('Q014', 'B', 'WHERE', 0),
('Q014', 'C', 'DISTINCT', 0),
('Q014', 'D', 'HAVING', 1),
('Q014', 'E', 'JOIN', 0),
('Q015', 'A', 'INNER JOIN', 0),
('Q015', 'B', 'CROSS JOIN', 0),
('Q015', 'C', 'LEFT JOIN', 1),
('Q015', 'D', 'RIGHT JOIN', 0),
('Q015', 'E', 'SELF JOIN obrigatório', 0),
('Q016', 'A', 'O usuário pode cadastrar um curso', 0),
('Q016', 'B', 'O sistema deve responder à consulta em até dois segundos sob carga definida', 1),
('Q016', 'C', 'O administrador pode excluir uma questão', 0),
('Q016', 'D', 'O aluno pode selecionar uma alternativa', 0),
('Q016', 'E', 'O sistema permite filtrar cursos por categoria', 0),
('Q017', 'A', 'Empregar termos vagos como rapidamente', 0),
('Q017', 'B', 'Evitar critérios de aceitação', 0),
('Q017', 'C', 'Descrever somente a solução técnica', 0),
('Q017', 'D', 'Utilizar frases que não podem ser medidas', 0),
('Q017', 'E', 'Estabelecer condições observáveis e critérios de aceitação objetivos', 1),
('Q018', 'A', 'Associar requisitos a origem, implementação e testes', 1),
('Q018', 'B', 'Eliminar a necessidade de documentação', 0),
('Q018', 'C', 'Substituir o controle de versões', 0),
('Q018', 'D', 'Evitar qualquer mudança de escopo', 0),
('Q018', 'E', 'Permitir que requisitos sejam sempre ambíguos', 0),
('Q019', 'A', 'Sequência', 0),
('Q019', 'B', 'Atividade', 0),
('Q019', 'C', 'Estados', 0),
('Q019', 'D', 'Classes', 1),
('Q019', 'E', 'Implantação', 0),
('Q020', 'A', 'Casos de uso', 0),
('Q020', 'B', 'Componentes', 0),
('Q020', 'C', 'Sequência', 1),
('Q020', 'D', 'Pacotes', 0),
('Q020', 'E', 'Objetos', 0),
('Q021', 'A', 'Obrigatoriamente uma pessoa autenticada', 0),
('Q021', 'B', 'Uma entidade externa que interage com o sistema', 1),
('Q021', 'C', 'Um método privado da aplicação', 0),
('Q021', 'D', 'Uma tabela de banco de dados', 0),
('Q021', 'E', 'Uma classe abstrata do código', 0),
('Q022', 'A', 'SMTP', 0),
('Q022', 'B', 'FTP', 0),
('Q022', 'C', 'SSH', 0),
('Q022', 'D', 'DHCP', 0),
('Q022', 'E', 'DNS', 1),
('Q023', 'A', 'Números de sequência e confirmações de recebimento', 1),
('Q023', 'B', 'Broadcast obrigatório em todos os pacotes', 0),
('Q023', 'C', 'Ausência de estado de conexão', 0),
('Q023', 'D', 'Criptografia ponta a ponta nativa obrigatória', 0),
('Q023', 'E', 'Desativação do controle de fluxo', 0),
('Q024', 'A', 'UDP garante entrega e ordenação por padrão', 0),
('Q024', 'B', 'UDP exige o estabelecimento de uma conexão TCP', 0),
('Q024', 'C', 'UDP criptografa automaticamente todos os datagramas', 0),
('Q024', 'D', 'UDP é orientado a datagramas e não garante entrega ou ordenação por si só', 1),
('Q024', 'E', 'UDP utiliza exclusivamente a porta 443', 0),
('Q025', 'A', 'Autenticação define permissões e autorização valida identidade', 0),
('Q025', 'B', 'Ambas são sempre equivalentes', 0),
('Q025', 'C', 'Autenticação confirma a identidade; autorização determina o acesso permitido', 1),
('Q025', 'D', 'Autorização existe apenas em redes locais', 0),
('Q025', 'E', 'Autenticação serve apenas para criptografar dados', 0),
('Q026', 'A', 'Conceder acesso administrativo a todos', 0),
('Q026', 'B', 'Oferecer somente permissões necessárias às atividades', 1),
('Q026', 'C', 'Compartilhar a mesma senha entre equipes', 0),
('Q026', 'D', 'Desativar logs de acesso', 0),
('Q026', 'E', 'Manter permissões mesmo após mudança de função sem revisão', 0),
('Q027', 'A', 'Duas senhas diferentes', 0),
('Q027', 'B', 'Senha e pergunta secreta', 0),
('Q027', 'C', 'Dois códigos enviados por e-mail', 0),
('Q027', 'D', 'PIN e senha memorizada', 0),
('Q027', 'E', 'Senha e aplicativo autenticador no dispositivo', 1),
('Q028', 'A', 'Verificar uma pequena unidade de comportamento de modo isolado', 1),
('Q028', 'B', 'Avaliar apenas o consumo elétrico do servidor', 0),
('Q028', 'C', 'Testar todo o sistema em produção exclusivamente', 0),
('Q028', 'D', 'Substituir qualquer teste de integração', 0),
('Q028', 'E', 'Validar somente o design visual', 0),
('Q029', 'A', 'Para eliminar a necessidade de assertions', 0),
('Q029', 'B', 'Para usar apenas dados aleatórios', 0),
('Q029', 'C', 'Para depender de serviços externos instáveis', 0),
('Q029', 'D', 'Para produzir o mesmo resultado nas mesmas condições de entrada', 1),
('Q029', 'E', 'Para evitar execução automatizada', 0),
('Q030', 'A', 'Validar uma função de soma pura', 0),
('Q030', 'B', 'Verificar que um método rejeita entrada vazia', 0),
('Q030', 'C', 'Confirmar que a API grava e consulta registros em um banco de testes', 1),
('Q030', 'D', 'Comparar duas strings em memória', 0),
('Q030', 'E', 'Testar a formatação de uma data sem dependências', 0),
('Q031', 'A', 'ITIL é uma linguagem de programação e COBIT é um servidor', 0),
('Q031', 'B', 'ITIL orienta práticas de gestão de serviços e COBIT trata de governança e gestão de informação e tecnologia', 1),
('Q031', 'C', 'ITIL substitui normas jurídicas e COBIT define protocolos TCP', 0),
('Q031', 'D', 'COBIT é uma ferramenta de edição de código', 0),
('Q031', 'E', 'Ambos são exclusivamente métodos de teste unitário', 0),
('Q032', 'A', 'Eliminar definitivamente toda causa raiz na primeira resposta', 0),
('Q032', 'B', 'Modificar a arquitetura do sistema sem aprovação', 0),
('Q032', 'C', 'Suspender todos os serviços até o fim da auditoria', 0),
('Q032', 'D', 'Substituir o gerenciamento de problemas', 0),
('Q032', 'E', 'Restabelecer a operação normal do serviço o mais rápido possível', 1),
('Q033', 'A', 'Percentual de tempo em que o serviço permanece operacional no período definido', 1),
('Q033', 'B', 'Quantidade de linhas de código desenvolvidas', 0),
('Q033', 'C', 'Número de cores utilizadas na interface', 0),
('Q033', 'D', 'Total de computadores pessoais da equipe', 0),
('Q033', 'E', 'Número de campos de uma tabela SQL', 0),
('Q034', 'A', 'DELETE', 0),
('Q034', 'B', 'PATCH', 0),
('Q034', 'C', 'POST', 0),
('Q034', 'D', 'GET', 1),
('Q034', 'E', 'CONNECT', 0),
('Q035', 'A', '200', 0),
('Q035', 'B', '201', 0),
('Q035', 'C', '404', 1),
('Q035', 'D', '204', 0),
('Q035', 'E', '503', 0),
('Q036', 'A', 'Sempre cria exatamente dois recursos', 0),
('Q036', 'B', 'É idempotente em relação ao efeito pretendido da requisição', 1),
('Q036', 'C', 'Nunca pode atualizar um recurso', 0),
('Q036', 'D', 'É equivalente a uma conexão WebSocket', 0),
('Q036', 'E', 'Não pode carregar um corpo', 0),
('Q037', 'A', 'Para executar comandos SQL diretamente', 0),
('Q037', 'B', 'Para substituir o navegador', 0),
('Q037', 'C', 'Para impedir renderizações', 0),
('Q037', 'D', 'Para armazenar apenas senhas', 0),
('Q037', 'E', 'Para passar dados de um componente pai a um componente filho', 1),
('Q038', 'A', 'useState', 1),
('Q038', 'B', 'useMemo', 0),
('Q038', 'C', 'useId', 0),
('Q038', 'D', 'useRef apenas', 0),
('Q038', 'E', 'useContext exclusivamente', 0),
('Q039', 'A', 'Criptografar o HTML gerado', 0),
('Q039', 'B', 'Aumentar automaticamente o tamanho da lista', 0),
('Q039', 'C', 'Determinar a cor do elemento', 0),
('Q039', 'D', 'Ajudar o React a identificar os itens entre renderizações', 1),
('Q039', 'E', 'Eliminar a necessidade de map', 0),
('Q040', 'A', 'Qualquer informação sobre um equipamento sem vínculo com pessoa', 0),
('Q040', 'B', 'Informação relacionada a pessoa natural identificada ou identificável', 1),
('Q040', 'C', 'Somente informações financeiras sigilosas', 0),
('Q040', 'D', 'Apenas documentos com assinatura digital', 0),
('Q040', 'E', 'Somente dados considerados sensíveis', 0),
('Q041', 'A', 'Interesse comercial do fornecedor sem requisitos', 0),
('Q041', 'B', 'Publicação de qualquer dado em redes sociais', 0),
('Q041', 'C', 'Execução de contrato ou procedimentos preliminares relacionados a contrato a pedido do titular', 1),
('Q041', 'D', 'Ausência de política de privacidade', 0),
('Q041', 'E', 'Escolha de qualquer finalidade sem informar o titular', 0),
('Q042', 'A', 'Coletar todos os dados possíveis para usos futuros indeterminados', 0),
('Q042', 'B', 'Manter informações pessoais para sempre independentemente de finalidade', 0),
('Q042', 'C', 'Compartilhar todos os cadastros com terceiros por padrão', 0),
('Q042', 'D', 'Solicitar dados sensíveis mesmo sem relação com o serviço', 0),
('Q042', 'E', 'Limitar a coleta aos dados pertinentes, proporcionais e não excessivos à finalidade', 1);

-- Validacao pre-execucao: deve retornar 42, 210, 0, 0.

-- 1. Quantidade de questoes preparadas
SELECT COUNT(*) AS questoes_preparadas
FROM tmp_questoes_011;

-- 2. Quantidade de alternativas preparadas
SELECT COUNT(*) AS alternativas_preparadas
FROM tmp_alternativas_011;

-- 3. Assuntos nao encontrados no banco
SELECT COUNT(*) AS assuntos_ausentes
FROM tmp_questoes_011 t
LEFT JOIN disciplinas d
    ON d.nome = t.disciplina
LEFT JOIN assuntos a
    ON a.nome = t.assunto
   AND a.disciplina_id = d.id
WHERE a.id IS NULL;

-- 4. Questoes com gabarito inconsistente
SELECT COUNT(*) AS gabaritos_invalidos
FROM (
    SELECT codigo
    FROM tmp_alternativas_011
    GROUP BY codigo
    HAVING COUNT(*) <> 5
        OR SUM(correta) <> 1
) AS validacao;


-- Antes de prosseguir, confirme que assuntos_ausentes=0 e gabaritos_invalidos=0.

START TRANSACTION;

-- Insere apenas questoes autorais ainda nao presentes (mesmo assunto + enunciado).
INSERT INTO questoes (assunto_id, concurso_id, enunciado, dificuldade, comentario_gabarito, origem, status)
SELECT a.id, NULL, t.enunciado, t.dificuldade, t.comentario_gabarito, 'AUTORAL', 'PUBLICADA'
FROM tmp_questoes_011 t
JOIN disciplinas d ON d.nome=t.disciplina
JOIN assuntos a ON a.disciplina_id=d.id AND a.nome=t.assunto
WHERE NOT EXISTS (SELECT 1 FROM questoes q WHERE q.assunto_id=a.id AND q.enunciado=t.enunciado);

-- Apenas completa alternativas ausentes; nao modifica gabaritos de questoes existentes.
INSERT INTO alternativas (questao_id, letra, texto, correta)
SELECT q.id, x.letra, x.texto, x.correta
FROM tmp_alternativas_011 x
JOIN tmp_questoes_011 t ON t.codigo=x.codigo
JOIN disciplinas d ON d.nome=t.disciplina
JOIN assuntos a ON a.disciplina_id=d.id AND a.nome=t.assunto
JOIN questoes q ON q.assunto_id=a.id AND q.enunciado=t.enunciado
WHERE NOT EXISTS (SELECT 1 FROM alternativas y WHERE y.questao_id=q.id AND y.letra=x.letra);

-- Verificacao do conjunto importado. Esperado: 42 questoes; 210 alternativas; nenhuma inconsistencia.
SELECT COUNT(*) AS questoes_localizadas,
       SUM(CASE WHEN qc.total_alternativas=5 AND qc.total_corretas=1 THEN 1 ELSE 0 END) AS questoes_validas
FROM (
 SELECT q.id, COUNT(alt.id) AS total_alternativas, SUM(COALESCE(alt.correta,0)) AS total_corretas
 FROM tmp_questoes_011 t
 JOIN disciplinas d ON d.nome=t.disciplina
 JOIN assuntos a ON a.disciplina_id=d.id AND a.nome=t.assunto
 JOIN questoes q ON q.assunto_id=a.id AND q.enunciado=t.enunciado
 LEFT JOIN alternativas alt ON alt.questao_id=q.id
 GROUP BY q.id
) qc;

SELECT d.nome AS disciplina, a.nome AS assunto, COUNT(*) AS questoes
FROM questoes q JOIN assuntos a ON a.id=q.assunto_id JOIN disciplinas d ON d.id=a.disciplina_id
JOIN tmp_questoes_011 t ON t.enunciado=q.enunciado AND t.assunto=a.nome AND t.disciplina=d.nome
GROUP BY d.nome, a.nome ORDER BY d.nome, a.nome;

-- Confira os resultados acima e confirme SOMENTE se houver 42 validas:
-- COMMIT;
-- Para desfazer antes do commit: ROLLBACK;

-- OBS: arquivos temporarios sao eliminados ao encerrar a conexao.
