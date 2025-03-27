README.md - Backend
Assistente Técnico Virtual - Backend
Este repositório contém o código do backend para o projeto do Assistente Técnico Virtual. O bot de atendimento é feito em Node.js, utilizando o venom-bot para interagir com os usuários no WhatsApp e o SQLite para armazenar dados de chamados técnicos.

Funcionalidades
Registro de Chamados: O sistema permite registrar problemas de equipamentos como notebooks e computadores, associando cada chamado a um número de protocolo único.

Consulta de Protocolo: O cliente pode consultar o status e as informações do seu chamado, fornecendo o número do protocolo.

Controle de Inatividade: O sistema encerra automaticamente o atendimento após 5 minutos de inatividade.

Requisitos
Antes de rodar o backend, instale as dependências necessárias.

Node.js (versão 18 ou superior)

SQLite3 (para o banco de dados)

Instalação
Clone o repositório:

bash
Copiar
git clone https://github.com/seu-usuario/assistencia-bot-backend.git
cd assistencia-bot-backend
Instale as dependências do projeto:

bash
Copiar
npm install
Certifique-se de que o Google Chrome está instalado no seu sistema e que o caminho para o executável esteja configurado corretamente. Caso contrário, edite o código para apontar para o caminho correto do seu Chrome.

Inicie o backend:

bash
Copiar
node bot.js
O bot irá começar a funcionar, e você verá a seguinte mensagem no terminal: 🚀 Bot iniciado com sucesso!.

Estrutura do Projeto
bot.js: Contém a lógica principal do bot, onde as interações com o usuário são tratadas.

database.js: Responsável pela conexão com o banco de dados e pela criação/atualização das tabelas de chamados.

package.json: Gerencia as dependências do projeto.

Dependências
venom-bot: Biblioteca para interação com o WhatsApp.

sqlite3: Banco de dados SQLite.

axios: Para fazer requisições HTTP (por exemplo, integração de transcrição de áudio).

puppeteer: Necessário para o funcionamento do venom-bot com headless Chrome.

Troubleshooting
Se o bot não iniciar corretamente, consulte o guia de resolução de problemas do Puppeteer.

Verifique se o caminho para o executável do Google Chrome está correto. O Puppeteer exige o Chrome para o funcionamento adequado.