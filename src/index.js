import axios from 'axios'

const postAPI = axios.create({
    baseURL: process.env.API_URL
})

const rootEl = document.querySelector('.root');
//로그인 상태를 전환하기 위한 변수
const toggleEl = document.querySelector('.state-toggle');
const loginEl = document.querySelector('.state-toggle-logIn');
const logoutEl = document.querySelector('.state-toggle-logOut');
//home 화면 전환을 위한 변수
const gotoHome = document.querySelector('.home');
const titleEl = document.querySelector('.title');
const logoEl = document.querySelector('.logo');
const addUsername = document.querySelector('.username');
//회원 가입 페이지 전환을 위한 변수
const signupEl = document.querySelector('.signUp');

const templates = {
    products: document.querySelector('#products').content,
    login: document.querySelector('#login').content,
    signup: document.querySelector('#signup').content,
    modal: document.querySelector('#modal').content
}
const token = localStorage.getItem('token');

function login(token) {
    localStorage.setItem('token', token);
    postAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
    toggleEl.classList.add('root--authed');
}

function logout() {
    localStorage.removeItem('token');
    delete postAPI.defaults.headers['Authorization'];
    toggleEl.classList.remove('root--authed');
}

function render(fragment) {
    rootEl.textContent = '';
    rootEl.appendChild(fragment);
}

async function indexPage() {
    const productsFragment = document.importNode(templates.products, true);

    let userid = 0;
    if (localStorage.getItem('token')) {
        let res = await postAPI.get('http://localhost:3000/me');
        userid = res.data.id;
        res = await postAPI.get(`http://localhost:3000/users/${userid}`);
        console.log(res.data.username);
        addUsername.textContent = `Welcome ${res.data.username}!`;
    }
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
        addUsername.textContent = '';
        logout();
    })
    signupEl.addEventListener('click', e => {
        signupPage();
    })


    render(productsFragment);
}
async function loginPage() {
    const loginFragment = document.importNode(templates.login, true);
    const loginformEl = loginFragment.querySelector('.login__main-form');

    loginformEl.addEventListener('submit', async e => {
        const payload = {
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        };
        e.preventDefault();
        let res = await postAPI.post('http://localhost:3000/users/login', payload);
        login(res.data.token);
        res = await postAPI.get('http://localhost:3000/me');
        const userid = res.data.id
        indexPage();
    })
    render(loginFragment);
}

async function signupPage() {
    const signupFrament = document.importNode(templates.signup, true);
    const signupFormEl = signupFrament.querySelector('.signup__main-form');

    const modalFragment = document.importNode(templates.modal, true);
    const confirmButton = modalFragment.querySelector('.modal-card__confirm-btn');
    signupFormEl.addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        }
        const userinfo = {
            address: e.target.elements.address.value,
            tel: e.target.elements.tel.value,
            email: e.target.elements.email.value
        }
        let res = await postAPI.post('http://localhost:3000/users/register', payload);
        console.log(res.data);
        login(res.data.token);
        res = await postAPI.get('http://localhost:3000/me');
        console.log(res.data.id);
        const userid = res.data.id
        res = await postAPI.post(`http://localhost:3000/users/${userid}/userinfo`, userinfo);
        render(modalFragment);
        confirmButton.addEventListener('click', e => {
            indexPage();
        });
    })
    signupFrament.querySelector('.cancel-btn').addEventListener('click', e => {
        indexPage();
    })

    render(signupFrament);
}

if (token) {
    login(token);
    indexPage();
} else {
    loginPage();
}
indexPage();