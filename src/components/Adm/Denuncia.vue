<template>
    <div class="container">
        <h1 style="color: white;">Denúncias</h1>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>Usuário (email)</th>
                    <th>Título</th>
                    <th>Denúncia</th>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Orgão</th>
                    <th>Urgência</th>
                    <th>Feedback</th>
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="denuncia in denuncias" :key="denuncia.id">
                    <td>{{ denuncia.usuario.email }}</td>
                    <td>{{ denuncia.titulo }}</td>
                    <td>{{ denuncia.texto }}</td>
                    <td>{{ formatarDataHora(denuncia.data) }}</td>
                    <td>{{ denuncia.tipo.nome }}</td>
                    <td>{{ denuncia.orgao.nome }}</td>
                    <td>{{ denuncia.urgencia }}</td>
                    <td><button @click="feedback(denuncia)" class="button">Feedback</button></td>
                    <td><button @click="remove(denuncia.id)" class="button">Excluir</button></td>
                </tr>
            </tbody>
        </table>

        <div v-if="showForm" class="form-container">
            <form @submit.prevent="submitForm" class="styled-form">
                <label for="nome">Feedback</label>
                <input type="text" id="text" v-model="text" required />
                <input type="submit" value="Enviar Feedback" class="button" />
                <button type="button" @click="showForm = false" class="button">Cancelar</button>
            </form>
        </div>
        <button style="margin-top: 8px;" type="button" class="button" @click="navigateTo('/adm')">Voltar</button>
    </div>
</template>

<script>
import axios from 'axios';
import { formatarDataHora } from '../../funcoes.js';

export default {
    name: 'Denuncias',
    data() {
        return {
            denuncias: [],
            showForm: false,
            form: {
                id: null,
                nome: ''
            },
            text: ''
        };
    },
    beforeMount() {
        const token = localStorage.getItem("token");
        if (token == null)
            window.location.replace("\login");
    },
    mounted() {
        this.getLista();
    },
    methods: {
        formatarDataHora,
        navigateTo(route) {
            this.$router.push(route);
        },
        async getLista() {
            try {
                const url = "http://localhost:8080/apis/adm/get-all-denuncias";
                const response = await axios.get(url);
                this.denuncias = response.data;
            } catch (error) {
                alert('Falha ao carregar lista: ' + (error.response?.data?.message || error.message));
            }
        },
        async feedback(denuncia) {
            this.form = { ...denuncia };
            this.showForm = true;
        },
        async remove(id) {
            if (confirm('Tem certeza que deseja excluir esta denúncia?')) {
                try {
                    const url = `http://localhost:8080/apis/adm/delete-denuncia?id=${id}`;
                    await axios.delete(url);
                    this.denuncias = this.denuncias.filter(denuncia => denuncia.id !== id);
                } catch (error) {
                    alert('Falha ao excluir denúncia: ' + (error.response?.data?.message || error.message));
                }
            }
        },
        async submitForm() {
            try {
                const feedback = {
                    texto: this.text,
                    denuncia: this.form
                };
                console.log(feedback);
                const url = "http://localhost:8080/apis/adm/add-feedback";
                await axios.post(url, feedback);
                this.getLista();
                this.resetForm();
            } catch (error) {
                alert('Falha ao enviar feedback: ' + (error.response?.data?.message || error.message));
            }
        },
        resetForm() {
            this.form = null;
            this.text = '';
            this.showForm = false;
        }
    }
};
</script>

<style>
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
    background-color: #4CAF50;
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
    border-bottom: 2px solid #4CAF50;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #4CAF50;
}

.button {
    background-color: #4CAF50;
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
.styled-form button[type="button"] {
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.styled-form input[type="submit"],
.styled-form button[type="button"] {
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
}

.styled-form input[type="submit"]:hover,
.styled-form button[type="button"]:hover {
    background-color: #45a049;
}

.template {
    background-color: black;
}
</style>
