'use strict';
let gFilter;

window.addEventListener('load', onInit);


function onInit() {
    renderFilters();
    renderImages();
    onPageNumUpdate()
    addEventLiseners();
}

function addEventLiseners() {
    document.querySelector('.prev-page').addEventListener('click', onBackPage);
    document.querySelector('.next-page').addEventListener('click', onNextPage);
    document.querySelector('.gallery-btn').addEventListener('click', onGalleryBtn);
    document.querySelector('.my-memes-btn').addEventListener('click', onMyMemes);
    let elFilterBtns = document.querySelectorAll('.filter-btn');
    elFilterBtns.forEach(btn => { btn.addEventListener('click', onFilerBtn, this); })
    let elImages = document.querySelectorAll('.card-img');
    elImages.forEach(image => { image.addEventListener('click', onimageBtn, this); })
}

function renderFilters() {
    let filters = getFilters();
    let filterStr = '';
    filterStr = filters.map(filter => {
        return `<div class="btn filter-btn flex justify-center  align-center" data-value="${filter}">${filter.toUpperCase()}</div>`
    }).join('');
    filterStr += `<div class="btn filter-btn flex justify-center align-center" data-value="all">All</div>`;
    document.querySelector('.filter-list').innerHTML = filterStr;

}

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
}

function renderSavedMames() {
    console.log('Saved Memes');
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
    document.querySelector('.canvas').classList.remove('show');
    onInit();
}

function onMyMemes() {
    renderSavedMames();
}

function onFilerBtn(btn) {
    let filter = btn.target.dataset.value;
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

function onimageBtn(image) {
    console.log(image.target.dataset.id);
    document.querySelector('.canvas').classList.add('show');
}

