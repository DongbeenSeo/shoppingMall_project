import axios from 'axios'

const rootEl = document.querySelector('.root');

const templates = {
    main: document.querySelector('#header').content
}

function render(fragment) {
    rootEl.textContent = '';
    rootEl.appendChild(fragment);
}

async function indexPage() {
    const fragment = document.importNode(templates.main, true);
    render(fragment);
}

indexPage();