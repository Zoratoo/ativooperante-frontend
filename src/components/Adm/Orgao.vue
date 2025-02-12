<template>
    <div class="container">
        <h1 style="color: white;">Orgãos</h1>
        <div>
            <button @click="showForm = true" class="button">Cadastrar</button>
        </div>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>Orgão</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="orgao in orgaos" :key="orgao.id">
                    <td>{{ orgao.nome }}</td>
                    <td><button @click="edit(orgao)" class="button">Editar</button></td>
                    <td><button @click="remove(orgao.id)" class="button">Excluir</button></td>
                </tr>
            </tbody>
        </table>

        <div v-if="showForm" class="form-container">
            <form @submit.prevent="submitForm" class="styled-form">
                <label for="nome">Orgão</label>
                <input type="text" id="nome" v-model="form.nome" required />
                <input type="submit" value="Enviar" class="button" />
                <button type="button" @click="showForm = false" class="button">Cancelar</button>
            </form>
        </div>
        <button style="margin-top: 8px;" type="button" class="button" @click="navigateTo('/adm')">Voltar</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Orgaos',
    data() {
        return {
            orgaos: [],
            showForm: false,
            form: {
                id: null,
                nome: ''
            }
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
        navigateTo(route) {
            this.$router.push(route);
        },
        async getLista() {
            try {
                const url = "http://localhost:8080/apis/adm/get-all-orgaos";
                const response = await axios.get(url);
                this.orgaos = response.data;
            } catch (error) {
                alert('Falha ao carregar lista: ' + (error.response?.data?.message || error.message));
            }
        },
        async remove(id) {
            if (confirm('Tem certeza que deseja excluir este orgão?')) {
                try {
                    const url = `http://localhost:8080/apis/adm/delete-orgao?id=${id}`;
                    await axios.delete(url);
                    this.orgaos = this.orgaos.filter(orgao => orgao.id !== id);
                } catch (error) {
                    alert('Falha ao excluir órgão: ' + (error.response?.data?.message || error.message));
                }
            }
        },
        edit(orgao) {
            this.form = { ...orgao };
            this.showForm = true;
        },
        async submitForm() {
            try {
                const orgao = {
                    id: this.form.id || null,
                    nome: this.form.nome
                }
                if (orgao.id) {
                    const url = `http://localhost:8080/apis/adm/update-orgao`;
                    await axios.put(url, orgao);
                } else {
                    const url = "http://localhost:8080/apis/adm/add-orgao";
                    await axios.post(url, orgao);
                }
                this.getLista();
                this.resetForm();
            } catch (error) {
                alert('Falha ao salvar órgão: ' + (error.response?.data?.message || error.message));
            }
        },
        resetForm() {
            this.form = { id: null, nome: '' };
            this.showForm = false;
        }
    }
};
</script>

<style scoped>
.container {
    background-color: orange;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 800px;
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
