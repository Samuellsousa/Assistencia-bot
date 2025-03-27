const venom = require('venom-bot');
const db = require('./database');

const estados = {}; // Armazena o estado do usuário
const excecoes = ['+1234567890', 'Nome do Contato']; // Contatos ou números a serem excluídos da transcrição

const tempoLimite = 5 * 60 * 1000; // 5 minutos em milissegundos
const timers = {}; // Para armazenar o timer de cada usuário



function gerarProtocolo(client) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  const dataFormatada = `${ano}-${mes}-${dia}`;

  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM contador_protocolo WHERE data = ?`,
      [dataFormatada],
      async (err, row) => {
        if (err) {
          return reject('Erro ao consultar contador: ' + err);
        }

        let numeroSequencial;

        if (row) {
          numeroSequencial = row.numero + 1;

          db.run(
            `UPDATE contador_protocolo SET numero = ? WHERE data = ?`,
            [numeroSequencial, dataFormatada],
            (updateErr) => {
              if (updateErr) {
                return reject('Erro ao atualizar contador: ' + updateErr);
              }
            }
          );
        } else {
          numeroSequencial = 1;
          db.run(
            `INSERT INTO contador_protocolo (data, numero) VALUES (?, ?)`,
            [dataFormatada, numeroSequencial],
            (insertErr) => {
              if (insertErr) {
                return reject('Erro ao inserir contador: ' + insertErr);
              }
            }
          );
        }

        const protocolo = `${ano}${mes}${dia}${String(numeroSequencial).padStart(3, '0')}`;
        resolve(protocolo);
      }
    );
  });
}

// Função para consultar ordem de serviço
function consultarOrdemServico(protocolo, client, numero) {
  const query = `SELECT * FROM mensagens WHERE protocolo = ?`;

  db.get(query, [protocolo], async (err, row) => {
    if (err) {
      console.error('Erro ao consultar ordem de serviço:', err);
      return;
    }

    if (row) {
      const status = row.status || '';
      const descricao_problema = row.descricao_problema || '';
      const valor_orcamento = row.valor_orcamento ? `R$ ${row.valor_orcamento}` : '';
      const equipamento = row.nome || '';
      const data_abertura = row.data || '';

      await client.sendText(
        numero,
        `📄 **Ordem de Serviço - Protocolo**: *${row.protocolo}*\n\n**Status**: *${status}*\n**Problema**: *${descricao_problema}*\n**Valor Orçamento**: *${valor_orcamento}*\n**Equipamento**: *${equipamento}*\n**Data de Abertura**: ${data_abertura}`
      );
    } else {
      await client.sendText(numero, '❗ Protocolo não encontrado.');
    }
  });
}

// Função para atualizar chamado
function atualizarChamado(protocolo, status, descricao_problema, valor_orcamento) {
  const query = `
    UPDATE mensagens
    SET status = ?, descricao_problema = ?, valor_orcamento = ?
    WHERE protocolo = ?
  `;

  db.run(query, [status, descricao_problema, valor_orcamento, protocolo], (err) => {
    if (err) {
      console.error('Erro ao atualizar chamado:', err);
    } else {
      console.log(`Chamado com protocolo ${protocolo} atualizado com sucesso.`);
    }
  });
}

// Função para salvar chamado
async function salvarChamado(numero, equipamento, problema, client, nomeCliente) {
  const data = new Date().toLocaleString();

  try {
    const protocolo = await gerarProtocolo(client); // Gerando o protocolo sequencial

    db.run(
      `INSERT INTO mensagens (cliente, nome, numero, mensagem, data, protocolo) VALUES (?, ?, ?, ?, ?, ?)`,
      [nomeCliente, equipamento, numero, problema, data, protocolo],
      async (err) => {
        if (err) {
          console.error('❌ Erro ao salvar chamado:', err);
        } else {
          try {
            await client.sendText(
              numero,
              `✅ Seu chamado foi registrado com sucesso!\n📄 **Protocolo**: *${protocolo}*\nUm técnico irá analisar e entrar em contato.`
            );
          } catch (errEnvio) {
            console.error('❌ Erro ao enviar protocolo:', errEnvio?.message || errEnvio);
          }
        }
      }
    );
  } catch (err) {
    console.error('❌ Erro ao gerar protocolo:', err);
  }
}

// Função para consultar ordem de serviço com base no protocolo
function consultarOrdemServico(protocolo, client, numero) {
  const query = `SELECT * FROM mensagens WHERE protocolo = ?`;

  db.get(query, [protocolo], async (err, row) => {
    if (err) {
      console.error('Erro ao consultar ordem de serviço:', err);
      await client.sendText(numero, '❗ Ocorreu um erro ao consultar o protocolo. Tente novamente.');
      return;
    }

    if (row) {
      // Caso o protocolo seja encontrado, envia as informações do chamado
      const status = row.status || 'Sem status';
      const descricao_problema = row.descricao_problema || 'Sem descrição';
      const valor_orcamento = row.valor_orcamento ? `R$ ${row.valor_orcamento}` : 'Sem valor';
      const equipamento = row.nome || 'Equipamento não informado';
      const data_abertura = row.data || 'Data não informada';

      // Envia as informações do chamado para o cliente
      await client.sendText(
        numero,
        `📄 **Ordem de Serviço - Protocolo**: *${row.protocolo}*\n\n**Status**: *${status}*\n**Problema**: *${descricao_problema}*\n**Valor Orçamento**: *${valor_orcamento}*\n**Equipamento**: *${equipamento}*\n**Data de Abertura**: ${data_abertura}`
      );
    } else {
      // Caso o protocolo não seja encontrado
      await client.sendText(numero, '❗ Protocolo não encontrado. Verifique o número e tente novamente.');
    }
  });
}

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg) return;

    const numero = message.from;
    const nomeCliente = message.sender?.pushname || 'Cliente';

    // Caso o usuário envie a opção de consultar protocolo
    if (message.body.trim().toLowerCase() === 'consultar protocolo') {
      await client.sendText(numero, '🔍 Por favor, envie o número do seu protocolo para consulta.');
      estados[numero] = 'consultar_protocolo';
      return;
    }

    if (!estados[numero]) {
      try {
        await client.sendText(
          numero,
          '👋 Olá! Sou o Assistente Técnico Virtual.\nComo posso te ajudar hoje?\n\n1️⃣ Problema no *notebook*\n2️⃣ Problema no *computador*\n3️⃣ Acompanhar serviço\n4️⃣ Falar com técnico\n5️⃣ Consultar protocolo'
        );
        estados[numero] = 'menu_principal';
      } catch (err) {
        console.error('❌ Erro ao enviar menu inicial:', err?.message || err);
      }
      return;
    }

    switch (estados[numero]) {
      case 'menu_principal':
        if (texto === '1') {
          try {
            await client.sendText(
              numero,
              '💻 Qual o problema no *notebook*?\nA) Não liga\nB) Tela azul / travando\nC) Está lento\nD) Outro\n\n📦 Qual o modelo do seu notebook?'
            );
            estados[numero] = 'problema_notebook';
          } catch (err) {
            console.error('❌ Erro ao enviar submenu notebook:', err?.message || err);
          }
        } else if (texto === '2') {
          try {
            await client.sendText(
              numero,
              '🖥️ Qual o problema no *computador*?\nA) Não liga\nB) Tela azul / travando\nC) Está lento\nD) Outro\n\n📦 Qual o modelo do seu computador?'
            );
            estados[numero] = 'problema_computador';
          } catch (err) {
            console.error('❌ Erro ao enviar submenu computador:', err?.message || err);
          }
        } else if (texto === '5') {
          await client.sendText(numero, '🔍 Por favor, envie seu número de protocolo para consulta.');
          estados[numero] = 'consultar_protocolo';
        }
        break;

      case 'problema_notebook':
      case 'problema_computador':
        const modelo = texto;  // O texto agora contém o modelo do equipamento

        // Solicita o problema e grava as informações no banco
        await client.sendText(numero, '💬 Descreva o problema do equipamento');
        estados[numero] = 'descricao_problema';

        // Salvar o chamado com o modelo
        salvarChamado(numero, texto, modelo, 'Problema técnico', client, nomeCliente);
        break;

      default:
        estados[numero] = null;
        await client.sendText(numero, '⚠️ Ocorreu um erro. Voltando ao menu...');
    }
  });
}


// Inicia o bot
venom
  .create({
    session: 'assistencia-bot-session',
    headless: 'new',
    useChrome: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  .then((client) => start(client))
  .catch((err) => {
    console.log('❌ Erro ao iniciar o bot:', err);
  });

async function processarAudio(message, client) {
  try {
    // Baixar o áudio
    const media = await client.downloadMedia(message);
    const audioUrl = media.url;

    // Aqui você usaria um serviço de transcrição (como Google Speech-to-Text, por exemplo)
    const transcricao = await transcreverAudio(audioUrl);

    // Salvar o chamado com a transcrição
    salvarChamado(message.from, 'Áudio', 'Problema de áudio transcrito', client, message.sender.pushname, transcricao);
  } catch (err) {
    console.error('❌ Erro ao processar áudio:', err);
  }
}

async function transcreverAudio(url) {
  try {
    // Aqui você integraria com uma API de transcrição (Google Speech-to-Text, por exemplo)
    const response = await axios.post('URL_DA_API_DE_TRANSCRICAO', { audioUrl: url });
    return response.data.transcricao; // Ajuste conforme a API que você escolher
  } catch (err) {
    console.error('❌ Erro ao transcrever áudio:', err);
    return 'Erro ao transcrever áudio';
  }
}

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg) return;

    const numero = message.from;
    const nomeCliente = message.sender?.pushname || 'Cliente';

    // Verificar se o número ou nome está na lista de exceções
    if (excecoes.includes(numero) || excecoes.includes(nomeCliente)) {
      console.log(`❌ Excluindo ${numero} de transcrição de áudio.`);
      return;
    }

    if (message.type === 'audio') {
      // Se for áudio, processa a transcrição
      await processarAudio(message, client);
      return;
    }

    // Caso não seja áudio, continue com o fluxo normal
    if (!message.body || typeof message.body !== 'string') {
      console.log(`📭 Mensagem ignorada de ${numero} (sem texto)`);
      return;
    }

    const texto = message.body.trim().toLowerCase();

    if (!estados[numero]) {
      try {
        await client.sendText(
          numero,
          '👋 Olá! Sou o Assistente Técnico Virtual.\nComo posso te ajudar hoje?\n\n1️⃣ Problema no *notebook*\n2️⃣ Problema no *computador*\n3️⃣ Acompanhar serviço\n4️⃣ Falar com técnico'
        );
        estados[numero] = 'menu_principal';
      } catch (err) {
        console.error('❌ Erro ao enviar menu inicial:', err?.message || err);
      }
      return;
    }

    switch (estados[numero]) {
      case 'menu_principal':
        if (texto === '1') {
          try {
            await client.sendText(
              numero,
              '💻 Qual o problema no *notebook*?\nA) Não liga\nB) Tela azul / travando\nC) Está lento\nD) Outro'
            );
            estados[numero] = 'problema_notebook';
          } catch (err) {
            console.error('❌ Erro ao enviar submenu notebook:', err?.message || err);
          }
        } else if (texto === '2') {
          try {
            await client.sendText(
              numero,
              '🖥️ Qual o problema no *computador*?\nA) Não liga\nB) Tela azul / travando\nC) Está lento\nD) Outro'
            );
            estados[numero] = 'problema_computador';
          } catch (err) {
            console.error('❌ Erro ao enviar submenu computador:', err?.message || err);
          }
        } else if (texto === '3') {
          try {
            await client.sendText(numero, '🔎 Informe seu número de protocolo (essa funcionalidade será implementada em breve).');
            estados[numero] = null;
          } catch (err) {
            console.error('❌ Erro ao responder opção 3:', err?.message || err);
          }
        } else if (texto === '4') {
          try {
            await client.sendText(numero, '✅ Encaminhando para o técnico...');
            estados[numero] = null;
          } catch (err) {
            console.error('❌ Erro ao responder opção 4:', err?.message || err);
          }
        } else {
          try {
            await client.sendText(numero, '❗ Opção inválida. Escolha entre 1, 2, 3 ou 4.');
          } catch (err) {
            console.error('❌ Erro ao enviar opção inválida:', err?.message || err);
          }
        }
        break;

      case 'problema_notebook':
        if (['a', 'b', 'c', 'd'].includes(texto)) {
          const problemas = {
            a: 'Não liga',
            b: 'Tela azul / travando',
            c: 'Está lento',
            d: 'Outro',
          };
          salvarChamado(numero, 'Notebook', problemas[texto], client, nomeCliente);
          estados[numero] = null;
        } else {
          try {
            await client.sendText(numero, '❗ Opção inválida. Escolha A, B, C ou D.');
          } catch (err) {
            console.error('❌ Erro ao enviar opção inválida (notebook):', err?.message || err);
          }
        }
        break;

      case 'problema_computador':
        if (['a', 'b', 'c', 'd'].includes(texto)) {
          const problemas = {
            a: 'Não liga',
            b: 'Tela azul / travando',
            c: 'Está lento',
            d: 'Outro',
          };
          salvarChamado(numero, 'Computador', problemas[texto], client, nomeCliente);
          estados[numero] = null;
        } else {
          try {
            await client.sendText(numero, '❗ Opção inválida. Escolha A, B, C ou D.');
          } catch (err) {
            console.error('❌ Erro ao enviar opção inválida (computador):', err?.message || err);
          }
        }
        break;

      default:
        estados[numero] = null;
        try {
          await client.sendText(numero, '⚠️ Ocorreu um erro. Voltando ao menu...');
        } catch (err) {
          console.error('❌ Erro ao enviar erro padrão:', err?.message || err);
        }
    }
  });
}
