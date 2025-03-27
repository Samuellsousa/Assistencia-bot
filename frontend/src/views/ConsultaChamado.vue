<template>
    <v-container>
      <v-card class="pa-5 mt-5" elevation="4">
        <v-card-title class="text-h5">
          Consultar Chamado
        </v-card-title>
  
        <v-text-field
          v-model="protocolo"
          label="Digite seu número de protocolo"
          clearable
          outlined
          class="mb-4"
          :rules="[rules.required, rules.isValidProtocolo]"
        />
  
        <v-btn @click="consultarChamado" color="primary" class="mt-4">Consultar</v-btn>
  
        <!-- Exibir dados do chamado se encontrados -->
        <v-card v-if="chamado" class="mt-5" elevation="2">
          <v-card-title>
            Detalhes do Chamado: {{ chamado.protocolo }}
          </v-card-title>
          <v-card-subtitle>
            <strong>Status:</strong> {{ chamado.status }}
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>Problema:</strong> {{ chamado.descricao_problema }}
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>Valor Orçamento:</strong> R$ {{ chamado.valor_orcamento }}
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>Equipamento:</strong> {{ chamado.equipamento }}
          </v-card-subtitle>
          <v-card-subtitle>
            <strong>Data de Abertura:</strong> {{ chamado.data_abertura }}
          </v-card-subtitle>
        </v-card>
  
        <!-- Exibir mensagem caso o protocolo não seja encontrado -->
        <v-alert v-if="erro" type="error" class="mt-5">
          {{ erro }}
        </v-alert>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  // Definindo variáveis reativas
  const protocolo = ref('')
  const chamado = ref(null)
  const erro = ref('')
  
  // Definindo regras de validação
  const rules = {
    required: value => !!value || 'O número do protocolo é obrigatório.',
    isValidProtocolo: value => /^[A-Za-z0-9-]+$/.test(value) || 'Protocolo inválido, insira um valor correto.',
  }
  
  // Função para consultar o chamado
  const consultarChamado = async () => {
    if (!protocolo.value) {
      erro.value = 'Por favor, insira o número do protocolo.'
      return
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/consultarChamado/${protocolo.value}`)
      chamado.value = response.data
      erro.value = ''
    } catch (err) {
      console.error('Erro ao consultar chamado:', err)
      erro.value = 'Chamado não encontrado ou erro ao consultar. Tente novamente.'
      chamado.value = null
    }
  }
  </script>
  
  <style scoped>
  /* Estilo global para o contêiner */
  .container {
    padding: 20px;
    max-width: 1000px;
    margin: auto;
  }
  
  /* Estilo para os inputs */
  input {
    margin-bottom: 15px;
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  /* Estilo para os cards */
  .v-card {
    border-radius: 10px;
  }
  
  /* Estilo para o botão */
  .v-btn {
    display: block;
    width: 100%;
  }
  
  /* Adiciona responsividade */
  @media (max-width: 600px) {
    .v-card {
      padding: 10px;
    }
  
    .v-btn {
      width: auto;
    }
  }
  </style>
  