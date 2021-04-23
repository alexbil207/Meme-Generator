'use strict';

let gFilter;
let gElCanvas;
let gCtx;
let isDownload = false;

window.addEventListener('load', onInit);


function onInit() {
    initMemes();
    renderFilters();
    renderImages();
    canvasInit();
    onPageNumUpdate()
    addEventLiseners();

}
//main Screen listeners
function addEventLiseners() {
    document.querySelector('.prev-page').addEventListener('click', onBackPage);
    document.querySelector('.next-page').addEventListener('click', onNextPage);
    document.querySelector('.gallery-btn').addEventListener('click', onGalleryBtn);
    document.querySelector('.my-memes-btn').addEventListener('click', onMyMemes);
    document.querySelector('.toggle-menu-btn').addEventListener('click', onMenuBtn);
    document.querySelector('.filter-menu-btn').addEventListener('click', onFilterMenuBtn);
    document.querySelector('input[id="search"]').addEventListener('input', onSearchInput);
    document.querySelector('.close-editor').addEventListener('click', onCloseEditorBtn);
    setFilterEvents();
    setImagesEvents();
    setCanvasEvents();

}
//filter listeners
function setFilterEvents() {
    const elFilterBtns = document.querySelectorAll('.filter-btn');
    elFilterBtns.forEach(btn => { btn.addEventListener('click', onFilterBtn); })
}
//images grid listeners
function setImagesEvents() {
    const elImages = document.querySelectorAll('.card-img');
    elImages.forEach(image => { image.addEventListener('click', onImageBtn); })
}

// Filters Render
function renderFilters() {
    let filters = getFilters();
    let filterStr = '';
    filterStr = filters.map(filter => {
        return `<div class="btn filter-btn flex justify-center  align-center" data-value="${filter}">${filter.toUpperCase()}</div>`
    }).join('');
    filterStr += `<div class="btn filter-btn flex justify-center align-center" data-value="all">All</div>`;
    document.querySelector('.filter-list').innerHTML = filterStr;

}
//Grid images render
function renderImages(filter = 'all') {
    let images = getImages(filter);
    let imagesStr = '';
    imagesStr = images.map(image => {
        return `
        <div class="img-preview grid justify-center align-center" data-id="${image.id}">
            <img class="card-img" src="${image.image}" data-id="${image.id}">
        </div> 
        `
    }).join('')
    document.querySelector('.image-grid').innerHTML = imagesStr;
    pageCountDisplay();
    setImagesEvents();
}

function onNextPage() {
    nextPage();
    renderImages(gFilter);
    onPageNumUpdate()
}

function onBackPage() {
    backPage();
    renderImages(gFilter);
    onPageNumUpdate()
}

function onGalleryBtn() {
    onInit();
}

function onFilterBtn(ev) {
    const elMenu = document.querySelector('.filter-list');
    const menuBtn = document.querySelector('.filter-menu-btn');
    if (elMenu.classList.value.includes('show')) toggleMenu(menuBtn, 'Filters', '✖', elMenu);
    let filter = ev.target.dataset.value;
    gFilter = filter;
    renderImages(filter)

}

function onPageNumUpdate() {
    let pageNum = getPageNum();
    document.querySelector('.num-pages').innerText = pageNum + 1;
}

function pageCountDisplay() {
    if (!isPageNav) document.querySelector('.pages').classList.add('hidden');
    else document.querySelector('.pages').classList.remove('hidden');
}

function onImageBtn(ev) {
    let imgId = ev.target.dataset.id;
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    hide(document.querySelector('.saved-memes-container'));
    showHidden(document.querySelector('.canvas-editor'))
    let memeId = createMemes(imgId);
    document.querySelector('.canvas-options input').setAttribute("data-id", memeId);
    let meme = getMameById(memeId)
    renderCanvas(meme);

}

function onMenuBtn() {
    const menuBtn = document.querySelector('.toggle-menu-btn');
    const elMenu = document.querySelector('.nav-btns');
    toggleMenu(menuBtn, '☰', '✖', elMenu)
}

function onFilterMenuBtn() {
    const menuBtn = document.querySelector('.filter-menu-btn');
    const elMenu = document.querySelector('.filter-list');
    toggleMenu(menuBtn, 'Filters', '✖', elMenu)
}

function toggleMenu(currElement, textOpen, textClose, elMenu) {
    if (currElement.classList.value.includes('hidden')) {
        currElement.classList.remove('hidden');
        currElement.innerText = textClose;
        showHidden(elMenu);
    }
    else {
        currElement.classList.add('hidden');
        currElement.innerText = textOpen;
        hide(elMenu);
    }
}

function onSearchInput(input) {
    let textInput = ''
    if (input.data) {
        textInput += input.data;
        renderImages(textInput);
    } else {
        textInput = '';
        renderImages();
    }

}


