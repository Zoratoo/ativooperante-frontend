import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import FormAdm from './components/FormAdm.vue';
import FormCidadao from './components/FormCidadao.vue';
import FormLogin from './components/FormLogin.vue';
import Orgaos from './components/Adm/Orgao.vue';
import Problemas from './components/Adm/Tipo.vue';
import Denuncias from './components/Adm/Denuncia.vue';
import { getUserFromToken, getToken } from './funcoes.js';

const routes = [
    { path: '/', component: FormLogin },
    { path: '/adm', component: FormAdm, meta: { requiresAuth: true, nivel: ["1"] } },
    { path: '/cidadao', component: FormCidadao, meta: { requiresAuth: true, nivel: ["1", "2"] } },
    { path: '/login', component: FormLogin },
    { path: '/adm/orgaos', component: Orgaos, meta: { requiresAuth: true, nivel: ["1"] } },
    { path: '/adm/tipos-de-problemas', component: Problemas, meta: { requiresAuth: true, nivel: ["1"] } },
    { path: '/adm/denuncias', component: Denuncias, meta: { requiresAuth: true, nivel: ["1"] } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = getToken();

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login');
        } else {
            const user = getUserFromToken(token); 
            if (!user || (to.meta.nivel && !to.meta.nivel.includes(user.nivel))) {
                if (user && user.nivel === "1") {
                    next('/adm');
                } else if (user && user.nivel === "2") {
                    next('/cidadao');
                } else {
                    next('/login');
                }
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

const app = createApp(App);
app.use(router);
app.mount('#app');
