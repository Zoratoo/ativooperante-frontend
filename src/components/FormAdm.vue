<template>
  <div class="hello">
    <h1>Módulo do Administrador</h1>
    <div>
      <h3>Opções para gerenciar o sistema</h3>
      <div class="button-container">
        <button @click="navigateTo('/adm/orgaos')" class="button"><strong>Orgãos</strong></button>
        <button @click="navigateTo('/adm/tipos-de-problemas')" class="button"><strong>Tipos de
            Problemas</strong></button>
        <button @click="navigateTo('/adm/denuncias')" class="button"><strong>Denúncias</strong></button>
        <button @click="navigateTo('/cidadao')" class="button" style="background-color: #009879"><strong>Página
            Cidadão</strong></button>
      </div>
    </div>
    <button style="margin-top: 3%;" type="button" class="buttonVoltar" @click="navigateTo('/login')">Voltar</button>
  </div>
</template>

<script>
import { getUserFromToken } from '../funcoes.js';

export default {
  name: 'FormAdm',
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  },
  beforeMount() {
    const header = getUserFromToken();
    const token = localStorage.getItem("token");
    console.log(header);
    if (token == null)
      window.location.replace("\login");
  }
}
</script>

<style scoped>
.hello {
  background-color: orange;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  padding: 2%;
}

h3,
h1 {
  color: white;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.button {
  height: 400px;
  width: 200px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.button:hover {
  transform: scale(1.1);
  background-color: #45a049;
}

.buttonVoltar {
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.buttonVoltar:hover {
  transform: scale(1.1);
  background-color: #45a049;
}
</style>
