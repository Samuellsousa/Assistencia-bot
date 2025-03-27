const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// Habilitar o uso de CORS
app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Conectar ao banco de dados
const db = new sqlite3.Database('./zapbot.db');

// Endpoint para listar chamados
app.get('/chamados', (req, res) => {
  db.all('SELECT * FROM mensagens ORDER BY data DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Erro ao consultar chamados: ' + err.message);
    }
    res.json(rows);
  });
});

// Endpoint para atualizar chamado
app.post('/atualizarChamado', (req, res) => {
  const { protocolo, status, descricao, valorOrcamento } = req.body;

  // Verificação básica para garantir que todos os campos necessários estejam presentes
  if (!protocolo || !status || !descricao || valorOrcamento === undefined) {
    return res.status(400).send('Todos os campos (protocolo, status, descricao e valorOrcamento) são obrigatórios.');
  }

  db.run(
    `UPDATE mensagens SET status = ?, descricao_problema = ?, valor_orcamento = ? WHERE protocolo = ?`,
    [status, descricao, valorOrcamento, protocolo],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar chamado:', err);
        return res.status(500).send('Erro ao atualizar chamado');
      }

      res.status(200).send('Chamado atualizado com sucesso');
    }
  );
});

// Backend (Express)
// Backend (Express) - Endpoint para consultar chamado por protocolo
app.get('/consultarChamado/:protocolo', (req, res) => {
  const { protocolo } = req.params;

  db.get(
    `SELECT * FROM mensagens WHERE protocolo = ?`,
    [protocolo],
    (err, row) => {
      if (err) {
        console.error('Erro ao consultar chamado:', err);
        return res.status(500).json({ error: 'Erro ao consultar chamado', details: err.message });
      }

      if (row) {
        // Retorna os dados do chamado (status, orçamento e dados do equipamento)
        return res.status(200).json({
          protocolo: row.protocolo,
          status: row.status,
          descricao_problema: row.mensagem,
          valor_orcamento: row.valor_orcamento,
          equipamento: row.nome,
          data_abertura: row.data,
        });
      } else {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }
    }
  );
});



// Iniciar o servidor
app.listen(3000, () => {
  console.log('🚀 API rodando em http://localhost:3000');
});
