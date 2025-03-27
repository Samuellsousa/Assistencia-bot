const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./zapbot.db');

db.serialize(() => {
  // Criar tabela de mensagens
  db.run(`
    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT,
      nome TEXT,
      modelo TEXT, 
      numero TEXT,
      mensagem TEXT,
      data TEXT,
      protocolo TEXT    
    );
  `);

  // Criar tabela para contador de protocolos (número sequencial por dia)
  db.run(`
    CREATE TABLE IF NOT EXISTS contador_protocolo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,  -- Data no formato YYYY-MM-DD
      numero INTEGER DEFAULT 0
    );
  `);

  // Criar um índice na tabela contador_protocolo para otimizar consultas por data
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_data_contador ON contador_protocolo(data);
  `);
});

module.exports = db;
