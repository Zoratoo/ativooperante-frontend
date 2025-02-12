<template>
  <div class="container">
    <h1 style="color: white;">Denúncias</h1>
    <div>
      <button @click="showForm = true" class="button">Fazer Denuncia</button>
    </div>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Denúncia</th>
          <th>Data</th>
          <th>Tipo</th>
          <th>Orgão</th>
          <th>Urgência</th>
          <th>Feedback</th>
          <th>Editar</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="denuncia in denuncias" :key="denuncia.id">
          <td>{{ denuncia.titulo }}</td>
          <td>{{ denuncia.texto }}</td>
          <td>{{ formatarDataHora(denuncia.data) }}</td>
          <td>{{ denuncia.tipo.nome }}</td>
          <td>{{ denuncia.orgao.nome }}</td>
          <td>{{ denuncia.urgencia }}</td>
          <td>{{ getFeedbackText(denuncia.id) }}</td>
          <td><button @click="edit(denuncia)" class="button">Editar</button></td>
          <td><button @click="remove(denuncia.id)" class="button">Excluir</button></td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="form-container">
      <form @submit.prevent="submitForm" class="styled-form">
        <label for="titulo">Título</label>
        <input type="text" id="titulo" v-model="form.titulo" required />
        <label for="texto">Texto</label>
        <input type="text" id="texto" v-model="form.texto" required />
        <label for="tipo">Tipo do Problema</label>
        <select id="tipo" v-model="form.tipo" required>
          <option v-for="tipo in tipos" :key="tipo.id" :value="tipo">{{ tipo.nome }}</option>
        </select>
        <label for="orgao">Orgão</label>
        <select id="orgao" v-model="form.orgao" required>
          <option v-for="orgao in orgaos" :key="orgao.id" :value="orgao">{{ orgao.nome }}</option>
        </select>
        <label for="urgencia">Urgência</label>
        <select id="urgencia" v-model="form.urgencia" required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <input type="submit" value="Enviar" class="button" />
        <button type="button" @click="showForm = false, resetForm()" class="button">Cancelar</button>
      </form>
    </div>
    <button style="margin-top: 8px;" type="button" class="button" @click="navigateTo('/login')">Voltar</button>
  </div>
</template>


<script>
import axios from 'axios';
import { formatarDataHora, getUserFromToken } from '../funcoes.js';

export default {
  name: 'FormCidadao',
  data() {
    return {
      denuncias: [],
      showForm: false,
      form: {
        id: null,
        titulo: '',
        texto: '',
        tipo: null,
        orgao: null,
        urgencia: '',
        usuario: null
      },
      tipos: [],
      orgaos: [],
      user: null,
      usuario: null,
      text: '',
      feedbacks: []
    };
  },
  beforeMount() {
    const token=localStorage.getItem("token");
    if(token==null)
        window.location.replace("\login");
  },
  mounted() {
    this.loadUserData();
    this.getOrgaos();
    this.getTipos();
    this.getUsuario();
  },
  methods: {
    formatarDataHora,
    navigateTo(route) {
      this.$router.push(route);
    },
    async loadUserData() {
      this.user = getUserFromToken();
      if (!this.user) {
        alert('Usuário não autenticado');
        this.$router.push('/login');
        return;
      }
      await this.getFeedbacks();
      await this.getLista();
    },
    async getFeedbacks() {
      try {
        const url = "http://localhost:8080/apis/cidadao/get-all-feedbacks";
        const response = await axios.get(url);
        this.feedbacks = response.data;
      } catch (error) {
        alert('Falha ao carregar lista: ' + (error.response?.data?.message || error.message));
      }
    },
    async getLista() {
      try {
        const url = `http://localhost:8080/apis/cidadao/get-denuncias-id/${this.user.sub}`;
        const response = await axios.get(url);
        this.denuncias = response.data;
      } catch (error) {
        alert('Falha ao carregar lista: ' + (error.response?.data?.message || error.message));
      }
    },
    async edit(denuncia) {
      this.form = { ...denuncia };
      this.showForm = true;
    },
    async remove(id) {
      if (confirm('Tem certeza que deseja excluir esta denúncia?')) {
        try {
          const url = `http://localhost:8080/apis/cidadao/delete-denuncia?id=${id}`;
          await axios.delete(url);
          this.denuncias = this.denuncias.filter(denuncia => denuncia.id !== id);
        } catch (error) {
          alert('Falha ao excluir denúncia: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    async submitForm() {
      try {
        this.form.usuario = this.usuario;
        console.log(this.form);
        const url = "http://localhost:8080/apis/cidadao/add-denuncia";
        console.log(this.form.texto);
        const response = await axios.post(url, this.form);
        this.denuncias.push(response.data);
        this.getLista();
        this.resetForm();
      } catch (error) {
        alert('Falha ao enviar feedback: ' + (error.response?.data?.message || error.message));
      }
    },
    resetForm() {
      this.form = {
        id: null,
        titulo: '',
        texto: '',
        data: '',
        tipo: null,
        orgao: null,
        urgencia: ''
      };
      this.text = '';
      this.showForm = false;
    },
    getFeedbackText(denunciaId) {
      const feedback = this.feedbacks.find(feedback => feedback.denuncia.id === denunciaId);
      return feedback ? feedback.texto : 'Sem feedback';
    },
    async getOrgaos() {
      const url = "http://localhost:8080/apis/cidadao/get-all-orgaos";
      await axios.get(url).then(response => {
        this.orgaos = response.data;
      }).catch(error => {
        alert('Falha ao carregar orgãos: ' + (error.response?.data?.message || error.message));
      });
    },
    async getTipos() {
      const url = "http://localhost:8080/apis/cidadao/get-all-tipos";
      await axios.get(url).then(response => {
        this.tipos = response.data;
      }).catch(error => {
        alert('Falha ao carregar tipos: ' + (error.response?.data?.message || error.message));
      });
    },
    async getUsuario() {
      try {
        const url = `http://localhost:8080/apis/cidadao/get-usuario-id/${this.user.sub}`;
        const response = await axios.get(url);
        this.usuario = response.data;
        console.log(this.usuario);
      } catch (error) {
        alert('Falha ao excluir denúncia: ' + (error.response?.data?.message || error.message));
      }
    }
  }
};
</script>

<style scoped>
body {
  background-color: gray;
  height: 100%;
  margin: 0;
}

.container {
  background-color: orange;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 18px;
  font-family: 'Arial', sans-serif;
  text-align: left;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.styled-table thead tr {
  background-color: #009879;
  color: white;
  text-align: center;
  font-weight: bold;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;;
}

.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}

.button {
  background-color: #009879;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.button:hover {
  transform: scale(1.1);
  background-color: #45a049;
}

.form-container {
  margin-top: 20px;
}

.styled-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.styled-form label {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
}

.styled-form input[type="text"],
.styled-form input[type="submit"],
.styled-form button[type="button"],
.styled-form input[type="date"],
.styled-form select {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.styled-form input[type="submit"],
.styled-form button[type="button"] {
  background-color: #009879;
  color: white;
  cursor: pointer;
}

.styled-form input[type="submit"]:hover,
.styled-form button[type="button"]:hover {
  background-color: #45a049;
}

.styled-form input[type="number"] {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.styled-form input[type="number"]::-webkit-inner-spin-button,
.styled-form input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
