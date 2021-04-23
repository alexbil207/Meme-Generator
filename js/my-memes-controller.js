'use strict';



function onMyMemes() {
    showHidden(document.querySelector('.saved-memes-container'));
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    renderSavedImages();
}

function renderSavedImages() {
    let memesStr;
    const savedMemes = getSavedMemes();
    if (savedMemes) {
        memesStr = savedMemes.map(memes => {
            return `        
            <div class="img-preview grid justify-center align-center">
            <img class="card-meme" src="${memes.savedImageUrl}" data-id="${memes.selectedImgId}">
            <div>
                <button class="btn regular-btn remove-saved-btn" data-id="${memes.selectedImgId}">Remove</button>
            </div>
            </div> 
            `
        }).join('');
    } else {
        memesStr = `<h2>Empty</h2>`
    }
    document.querySelector('.saved-memes-grid').innerHTML = memesStr;
    setMyMemesEvents();

}

function setMyMemesEvents() {
    document.querySelector('.close-myMemes').addEventListener('click', onMyMemesClose);
    const removeBtns = document.querySelectorAll('.remove-saved-btn');
    removeBtns.forEach(btn => { btn.addEventListener('click', onRemoveMeme); })
    const memeCards = document.querySelectorAll('.card-meme');
    memeCards.forEach(meme => { meme.addEventListener('click', onMemeClick); })
}

function onMyMemesClose() {
    hide(document.querySelector('.saved-memes-container'));
    document.querySelector('.filter').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'block';
    renderImages();
}

function onMemeClick(ev) {
    const memeId = ev.target.dataset.id;
    hide(document.querySelector('.saved-memes-container'));
    showHidden(document.querySelector('.canvas-editor'));
    const meme = getMameById(memeId);
    renderCanvas(meme);
}

function onRemoveMeme(ev) {
    const id = ev.target.dataset.id;
    removeMeme(id);
    renderSavedImages();
}