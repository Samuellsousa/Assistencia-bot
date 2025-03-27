README.md - Frontend
Assistente Técnico Virtual - Frontend
Este repositório contém o código do frontend para o Assistente Técnico Virtual. A interface do usuário foi desenvolvida utilizando Vue.js 3 e Vuetify para interagir com os clientes e exibir os dados de chamados técnicos.

Funcionalidades
Consulta de Chamado: Permite ao usuário consultar o status do seu chamado técnico fornecendo o número do protocolo.

Exibição de Detalhes: Exibe as informações do chamado, como problema reportado, status, valor do orçamento e modelo do equipamento.

Busca de Chamados: O cliente pode buscar seus chamados através do número de protocolo ou descrição do problema.

Requisitos
Antes de rodar o frontend, instale as dependências necessárias.

Node.js (versão 18 ou superior)

Vue.js (3.x)

Vuetify (para UI)

Instalação
Clone o repositório:

bash
Copiar
git clone https://github.com/seu-usuario/assistencia-bot-frontend.git
cd assistencia-bot-frontend
Instale as dependências do projeto:

bash
Copiar
npm install
Inicie o servidor de desenvolvimento:

bash
Copiar
npm run dev
O frontend estará disponível em http://localhost:5173.

Estrutura do Projeto
App.vue: Contém a estrutura básica da aplicação, como o layout e as páginas.

ChamadosView.vue: Página principal para exibir e consultar chamados técnicos.

ChamadoService.js: Serviço responsável pelas requisições HTTP para o backend.

package.json: Gerencia as dependências do projeto.

Dependências
vue: Framework JavaScript para construção de interfaces de usuário.

vuetify: Framework de componentes de interface de usuário baseado em Material Design.

axios: Para realizar requisições HTTP ao backend.

Troubleshooting
Se o frontend não carregar corretamente, verifique o console do navegador para erros relacionados ao Vue.js ou ao Vuetify.

Se o backend não estiver respondendo, certifique-se de que o servidor está rodando na porta correta e que as requisições para a API estão funcionando como esperado.