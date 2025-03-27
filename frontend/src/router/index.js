import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ConsultaChamado from '../views/ConsultaChamado.vue' // Importando o componente de consulta

// Definindo as rotas
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/consultar-chamado',
    name: 'consultar-chamado',
    component: ConsultaChamado
  }
]

// Criando a instância do router com as rotas
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
