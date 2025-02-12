<template>
  <div class="login-container">
    <h1>{{ !showLogin ? 'Cadastrar-se' : 'Log-in' }}</h1>
    <div v-if="showLogin" class="form-wrapper">
      <form @submit.prevent="login">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" placeholder="Your email.." required />

        <label for="password" class="password-label">Password</label>
        <input type="password" v-model="password" @input="validatePassword" placeholder="Your password.." required />

        <input type="submit" value="Login" class="submit-button" />
      </form>
    </div>
    <div v-if="!showLogin" class="form-wrapper">
      <form @submit.prevent="cadastrar">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" placeholder="Your email.." required />
        <label for="cpf">CPF</label>
        <input type="text" id="cpf" v-model="cpf" placeholder="Your CPF.." required />
        <label for="password" class="password-label">Password</label>
        <input type="password" v-model="password" @input="validatePassword" placeholder="Your password.." required />
        <input type="submit" value="Cadastrar" class="submit-button" />
      </form>
    </div>
    <a style="cursor: pointer; color: blue; text-decoration: underline" @click="showLogin = !showLogin">{{ showLogin ?
      'Cadastrar-se' : 'Logar' }}</a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormLogin',
  data() {
    return {
      email: 'admin@pm.br',
      password: '123321',
      cpf: '',
      showLogin: true,
    };
  },
  methods: {
    async login() {
      const url = "http://localhost:8080/apis/login";
      const user = {
        email: this.email,
        senha: this.password
      };
      axios.post(url, user).then(response => {
        const token = response.data;
        localStorage.setItem("token", token);
        console.log(token);
        if (this.getNivelAcesso(token) == "1")
          window.location.href = "/adm";
        else
          window.location.href = "/cidadao";
      }).catch(error => {
        alert(error)
      })
    },
    async cadastrar() {
      const url = "http://localhost:8080/apis/cadastrar";
      const user = {
        email: this.email,
        cpf: this.cpf,
        senha: this.password
      };
      await axios.post(url, user);
      this.showLogin = true;
      alert('Cadastrado com sucesso');
    },
    getNivelAcesso(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      console.log("Payload decoded:", payload);
      return payload.nivel;
    },
    validatePassword(event) {
      const regex = /^[0-9]*$/;
      const newValue = event.target.value;
      if (!regex.test(newValue)) {
        this.password = newValue.replace(/[^0-9]/g, '');
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  margin: 5%;
  margin-left: 30%;
  margin-right: 30%;
  border-radius: 5%;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: #f2f2f2;
}

.form-wrapper {
  margin-bottom: 5%;
}

form {
  display: flex;
  flex-direction: column;
}

form>* {
  margin-bottom: 10px;
}

input[type="text"],
input[type="password"],
input[type="submit"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #45a049;
}

.password-label {
  padding-top: 1%;
}
</style>
