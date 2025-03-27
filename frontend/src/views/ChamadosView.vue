<template>
  <v-container>
    <v-card class="pa-5 mt-5" elevation="4">
      <v-card-title class="text-h5">
        Chamados Técnicos Registrados
      </v-card-title>

      <v-text-field
        v-model="busca"
        label="🔍 Buscar por protocolo ou número"
        clearable
        outlined
        class="mb-4"
      />

      <v-data-table
        :headers="headers"
        :items="chamadosFiltrados"
        :search="busca"
        dense
        item-value="id"
        no-data-text="Nenhum chamado encontrado."
      >
        <template #item.status="{ item }">
          <v-chip color="primary" label small>
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn @click="abrirDialogo(item)" color="blue" small>Editar</v-btn>
        </template>
      </v-data-table>

      <!-- Diálogo de edição -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Editar Chamado</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="edicao.descricao" label="Descrição do problema" outlined />
            <v-text-field v-model="edicao.valorOrcamento" label="Valor do orçamento" outlined type="number" />
            <v-select v-model="edicao.status" :items="statusOptions" label="Status" outlined />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="salvarAlteracoes" color="primary" :loading="loading">Salvar</v-btn>
            <v-btn @click="dialog = false" color="grey">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listarChamados } from '../services/ChamadoService'
import axios from 'axios'

const chamados = ref([])
const chamadosFiltrados = ref([])
const busca = ref('')
const dialog = ref(false)
const loading = ref(false) // Controla o estado de carregamento durante a atualização
const edicao = ref({
  descricao: '',
  valorOrcamento: '',
  status: '',
  protocolo: ''
})

const statusOptions = ['Aberto', 'Em andamento', 'Finalizado']

const headers = [
  { title: 'Protocolo', value: 'protocolo' },
  { title: 'Equipamento', value: 'nome' },
  { title: 'Problema', value: 'mensagem' },
  { title: 'Status', value: 'status' },
  { title: 'Valor Orçamento', value: 'valor_orcamento' },
  { title: 'Ações', value: 'actions' }
]

const filtrarChamados = () => {
  const termo = busca.value.toLowerCase()
  chamadosFiltrados.value = chamados.value.filter(c =>
    c.protocolo?.toLowerCase().includes(termo) || c.numero?.includes(termo)
  )
}

const abrirDialogo = (item) => {
  edicao.value = { ...item }
  dialog.value = true
}

const salvarAlteracoes = async () => {
  if (!edicao.value.status || !edicao.value.descricao || !edicao.value.valorOrcamento) {
    alert('Todos os campos são obrigatórios.');
    return;
  }

  loading.value = true; // Inicia o carregamento

  try {
    await axios.post('http://localhost:3000/atualizarChamado', {
      protocolo: edicao.value.protocolo,
      status: edicao.value.status,
      descricao: edicao.value.descricao,
      valorOrcamento: edicao.value.valorOrcamento
    });

    // Atualiza a lista de chamados após sucesso
    chamados.value = await listarChamados();
    chamadosFiltrados.value = chamados.value;

    dialog.value = false;
  } catch (err) {
    console.error('Erro ao salvar alterações:', err);
    alert('Ocorreu um erro ao salvar as alterações.');
  } finally {
    loading.value = false; // Finaliza o carregamento
  }
}

onMounted(async () => {
  chamados.value = await listarChamados()
  chamadosFiltrados.value = chamados.value
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}
input {
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}
th {
  background-color: #f2f2f2;
}
</style>
