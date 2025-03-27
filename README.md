Assistente Técnico Virtual - WhatsApp Bot
Este é um projeto de um assistente técnico virtual que interage com os usuários através do WhatsApp utilizando a biblioteca venom-bot. O bot permite registrar chamados técnicos, consultar protocolos de atendimento, e realizar atendimento com um tempo de inatividade definido.

Funcionalidades
Registro de Chamados: O bot permite que o cliente registre um chamado técnico para problemas em notebooks ou computadores, com a opção de incluir a descrição do problema e o modelo do equipamento.

Consulta de Protocolo: O cliente pode consultar o status do seu chamado técnico utilizando o número do protocolo gerado no momento do registro do chamado.

Controle de Inatividade: Se o cliente ficar inativo por 5 minutos, o atendimento será automaticamente encerrado, liberando o atendimento para outros clientes.

Mensagens de Áudio: O bot também processa mensagens de áudio, realizando a transcrição e incluindo no chamado como texto.

Requisitos
Antes de executar o projeto, certifique-se de que você tem as seguintes ferramentas instaladas:

Node.js (versão 18 ou superior)

Google Chrome (para o funcionamento do navegador headless)

SQLite3 (para o banco de dados)

Instalação
Siga os passos abaixo para rodar o projeto:

1. Clonar o Repositório
Clone este repositório para sua máquina local:

bash
Copiar
git clone https://github.com/seu-usuario/assistencia-bot.git
cd assistencia-bot
2. Instalar as Dependências
Instale as dependências do projeto usando o npm:

bash
Copiar
npm install
3. Configurar o Banco de Dados
O projeto utiliza o SQLite como banco de dados. O arquivo do banco de dados será criado automaticamente quando você iniciar o bot pela primeira vez.

4. Configuração do Chrome
Certifique-se de que o Google Chrome está instalado e acessível no caminho indicado no código (ou ajuste o caminho no código). Caso contrário, você pode precisar configurar a variável executablePath para o caminho do Chrome em seu sistema.

5. Iniciar o Bot
Inicie o bot com o seguinte comando:

bash
Copiar
node bot.js
O bot começará a funcionar e você verá a seguinte mensagem no terminal: 🚀 Bot iniciado com sucesso!.

Como Funciona
Menu Inicial: Ao enviar uma mensagem para o bot no WhatsApp, o cliente verá um menu com opções para reportar problemas em notebooks, computadores ou consultar um protocolo.

Registrar Chamado: Ao selecionar a opção de problemas, o bot pede informações como a descrição do problema e o modelo do equipamento. O protocolo é gerado automaticamente e enviado ao cliente.

Consultar Protocolo: Quando o cliente escolhe a opção de consultar um protocolo, ele deve fornecer o número do protocolo, e o bot retorna o status do chamado técnico e os detalhes associados ao mesmo.

Tempo de Inatividade: Se o cliente não enviar uma mensagem por 5 minutos, o bot encerrará automaticamente o atendimento e informará ao cliente.

Estrutura do Projeto
bot.js: Arquivo principal onde o bot é configurado e as interações com os clientes são gerenciadas.

database.js: Arquivo responsável pela criação e manipulação do banco de dados SQLite.

package.json: Arquivo que contém todas as dependências do projeto.

Dependências
venom-bot: Biblioteca para interação com o WhatsApp.

sqlite3: Biblioteca para interação com banco de dados SQLite.

axios: Para fazer requisições HTTP (caso você deseje integrar com APIs externas).

puppeteer: Necessário para o funcionamento do venom-bot com headless Chrome.

Possíveis Melhorias
Autenticação: Adicionar autenticação para garantir que apenas clientes autorizados possam registrar e consultar chamados.

Integração com mais APIs: Integrar com APIs externas para transcrição de áudio, detecção de problemas automáticos, ou sistemas de feedback.

Interface de Usuário: Criar uma interface de usuário para os técnicos poderem visualizar e gerenciar os chamados.

Logs e Monitoramento: Adicionar logs para monitoramento do sistema e diagnóstico.

Troubleshooting
Caso o bot não inicie corretamente, consulte o guia de resolução de problemas no site do Puppeteer.

Se o erro persistir, verifique se o Google Chrome está instalado corretamente e se o caminho para o executável está correto.