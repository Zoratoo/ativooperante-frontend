export function formatarDataHora(dataHoraString) {
    const dataHora = new Date(dataHoraString);

    const dia = dataHora.getDate().toString().padStart(2, '0');
    const mes = (dataHora.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataHora.getFullYear();
    const hora = dataHora.getHours().toString().padStart(2, '0');
    const minuto = dataHora.getMinutes().toString().padStart(2, '0');
    const segundo = dataHora.getSeconds().toString().padStart(2, '0');

    const dataHoraFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

    return dataHoraFormatada;
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUserFromToken() {
    const token = getToken();
    console.log(token);
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
}