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
const gotoHomebtn = document.querySelector('.home-btn');
const titleEl = document.querySelector('.title');
const logoEl = document.querySelector('.logo');
const addUsername = document.querySelector('.username');
//회원 가입 페이지 전환을 위한 변수
const signupEl = document.querySelector('.signup-btn');
//my page화면 전환 변수
const mypageBtn = document.querySelector('.mypage-btn');

const templates = {
    products: document.querySelector('#products').content,
    cards: document.querySelector('#product-card').content,
    detail: document.querySelector('#product__detail').content,
    login: document.querySelector('#login').content,
    signup: document.querySelector('#signup').content,
    modal: document.querySelector('#modal').content,
    mypage: document.querySelector('#mypage').content,
    profile: document.querySelector('#profile').content,
    cart: document.querySelector('#carts').content,
    order: document.querySelector('#orders').content
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
        let res = await postAPI.get('/me');
        userid = res.data.id;
        res = await postAPI.get(`/users/${userid}`);
        addUsername.textContent = `Welcome ${res.data.username}!`;

        mypageBtn.addEventListener('click', async e => {
            mypage(userid, res.data.username);
        })
    } else {
        mypageBtn.addEventListener('click', e => {
            loginPage();
        })
    }

    logoEl.addEventListener('click', e => {
        indexPage();
    })
    titleEl.addEventListener('click', e => {
        indexPage();
    })
    gotoHomebtn.addEventListener('click', e => {
        indexPage();
    })
    loginEl.addEventListener('click', e => {
        loginPage();
    })
    logoutEl.addEventListener('click', e => {
        addUsername.textContent = '';
        logout();
        indexPage();
    })
    signupEl.addEventListener('click', e => {
        signupPage();
    });
    // /nike.f3d483da.PNG
    const productRes = await postAPI.get('/products');
    const card = productsFragment.querySelector('.products__cards');
    productRes.data.forEach(product => {
        const cardFragment = document.importNode(templates.cards, true);
        cardFragment.querySelector('.productimage').src = product.image;
        cardFragment.querySelector('.productname').textContent = product.productname;
        cardFragment.querySelector('.productprice').textContent = product.price;
        cardFragment.querySelector('.products__cards-box').addEventListener('click', e => {
            e.preventDefault();
            productDetail(product.id);
        })
        card.appendChild(cardFragment);
    });
    render(productsFragment);
}

async function productDetail(productId) {
    const detailFragment = document.importNode(templates.detail, true);
    const res = await postAPI.get(`/products/${productId}`);
    let userid = 0;

    detailFragment.querySelector('img').src = res.data.image;
    detailFragment.querySelector('h1').textContent = res.data.productname;

    detailFragment.querySelector('.cart-btn').addEventListener('click', async e => {
        if (localStorage.getItem('token')) {
            const modalFragment = document.importNode(templates.modal, true);
            let res = await postAPI.get('/me');
            userid = res.data.id;
            res = await postAPI.get(`/users/${userid}`);
            const payload = {
                productId: productId
            }
            modalFragment.querySelector('.modal-card-title').textContent = '장바구니'
            modalFragment.querySelector('.modal-card-body').textContent = '장바구니에 담으시겠습니까?';
            modalFragment.querySelector('.modal-card__confirm-btn').addEventListener('click', async e => {
                e.preventDefault();
                await postAPI.post('/carts/', payload);
                mypage(userid, res.data.username);
            });
            modalFragment.querySelector('.delete').addEventListener('click', e => {
                e.preventDefault();
                productDetail(productId);
            })
            render(modalFragment);
        } else {
            loginPage();
        }
    })
    render(detailFragment);
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
        let res = await postAPI.post('/users/login', payload);
        login(res.data.token);
        res = await postAPI.get('/me');
        const userid = res.data.id
        indexPage();
    })
    loginFragment.querySelector('.login-back-btn').addEventListener('click', e => {
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
        let res = await postAPI.post('/users/register', payload);
        login(res.data.token);
        res = await postAPI.get('/me');
        const userid = res.data.id
        res = await postAPI.post(`/users/${userid}/userinfos`, userinfo);
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

function mypage(userid, username) {
    const mypageFragment = document.importNode(templates.mypage, true);
    const profileFragment = document.importNode(templates.profile, true);
    const mypageMainEl = mypageFragment.querySelector('.mypage__main');
    const profileBtn = mypageFragment.querySelector('.mypage__menu-list-profile');
    const cartBtn = mypageFragment.querySelector('.mypage__menu-list-cart');
    const orderBtn = mypageFragment.querySelector('.mypage__menu-list-orderlist');

    profilePage(mypageMainEl, userid, username);

    profileBtn.addEventListener('click', e => {
        profileBtn.classList.add('is-active');
        cartBtn.classList.remove('is-active');
        orderBtn.classList.remove('is-active');
        profilePage(mypageMainEl, userid, username);
    })

    cartBtn.addEventListener('click', e => {
        profileBtn.classList.remove('is-active');
        cartBtn.classList.add('is-active');
        orderBtn.classList.remove('is-active');
        cartPage(mypageMainEl, userid);
    })
    orderBtn.addEventListener('click', e => {
        profileBtn.classList.remove('is-active');
        cartBtn.classList.remove('is-active');
        orderBtn.classList.add('is-active');
        orderPage(mypageMainEl, userid);
    })

    render(mypageFragment);
}

async function profilePage(mainEl, userid, username) {
    const profileFragment = document.importNode(templates.profile, true);
    const res = await postAPI.get(`/users/${userid}/userinfos`);

    const profileLists = profileFragment.querySelectorAll('.content');

    profileLists.forEach(list => {
        list.querySelector('.username').textContent = `${username}`;
        list.querySelector('.email').textContent = `${res.data[0].email}`;
        list.querySelector('.phonenumber').textContent = res.data[0].tel
        list.querySelector('.address').textContent = res.data[0].address
    })

    mainEl.textContent = '';
    mainEl.appendChild(profileFragment);
}

async function cartPage(mainEl, userid) {
    const cartFragment = document.importNode(templates.cart, true);
    const card = cartFragment.querySelector('.products__cards');
    const res = await postAPI.get(`/users/${userid}?_embed=carts`);
    let cartRes = [];
    res.data.carts.forEach(async cart => {
        cartRes = await postAPI.get(`/products/${cart.productId}`);
        const cardFragment = document.importNode(templates.cards, true);
        cardFragment.querySelector('.productimage').src = cartRes.data.image;
        cardFragment.querySelector('.productname').textContent = cartRes.data.productname;
        cardFragment.querySelector('.productprice').textContent = cartRes.data.price;
        card.appendChild(cardFragment);
    });

    mainEl.textContent = '';
    mainEl.appendChild(cartFragment);
}

async function orderPage(mainEl, userid) {
    const orderFragment = document.importNode(templates.order, true);
    mainEl.textContent = '';
    mainEl.appendChild(orderFragment);
}
if (token) {
    login(token);
    indexPage();
} else {
    loginPage();
}
indexPage();