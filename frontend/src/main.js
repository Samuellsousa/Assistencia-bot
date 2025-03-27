import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles' // Importando os estilos do Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Configurando Vuetify com tema customizado
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
