import axios from 'axios'

const postAPI = axios.create({
    baseURL: process.env.API_URL
})

const toggleEl = document.querySelector('.state-toggle');
const rootEl = document.querySelector('.root');
const loginEl = document.querySelector('.state-toggle-logIn');
const logoutEl = document.querySelector('.state-toggle-logOut');
const gotoHome = document.querySelector('.home');
const titleEl = document.querySelector('.main-title');
const logoEl = document.querySelector('.logo');
const signupEl = document.querySelector('.signUp');

const templates = {
    products: document.querySelector('#products').content,
    login: document.querySelector('#login').content,
    signup: document.querySelector('#signup').content
}

function login(token) {
    localStorage.setItem('token', token);
    postAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
    toggleEl.classList.add('root--authed');
    // logoutEl.classList.add('root-authed');
}

function logout() {
    localStorage.removeItem('token');
    delete postAPI.defaults.headers['Authorization'];
    toggleEl.classList.remove('root--authed');
    // logoutEl.classList.remove('root--authed');
}

function render(fragment) {
    rootEl.textContent = '';
    rootEl.appendChild(fragment);
}

function indexPage() {
    const productsFragment = document.importNode(templates.products, true);
    logoEl.addEventListener('click', e => {
        indexPage();
    })
    titleEl.addEventListener('click', e => {
        indexPage();
    })
    gotoHome.addEventListener('click', e => {
        indexPage();
    })
    loginEl.addEventListener('click', e => {
        loginPage();
    })
    logoutEl.addEventListener('click', e => {
        logout();
    })
    signupEl.addEventListener('click', e => {
        signupPage();
    })
    render(productsFragment);
}
async function loginPage() {
    const loginFragment = document.importNode(templates.login, true);
    const formEl = loginFragment.querySelector('.login__form');

    formEl.addEventListener('submit', async e => {
        const payload = {
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        };
        e.preventDefault();
        console.log(payload);
        const res = await postAPI.post('http://localhost:3000/users/login', payload);
        console.log(res.data);
        login(res.data.token);
        indexPage();
    })
    render(loginFragment);
}

function signupPage() {
    const signupFrament = document.importNode(templates.signup, true);
    signupFrament.querySelector('.cancel-btn').addEventListener('click', e => {
        indexPage();
    })
    render(signupFrament);
}
const token = localStorage.getItem('token');
if (token) {
    login(token);
    indexPage();
} else {
    loginPage();
}
indexPage();