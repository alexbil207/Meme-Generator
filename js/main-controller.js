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
// canvas Editor Events
function setCanvasEvents() {
    document.querySelector('.control-editor-btns a').addEventListener('click', downloadImg);
    document.querySelector('.canvas-options input').addEventListener('input', onTextInput);
    document.querySelector('.canvas-options input').addEventListener('click', onLineCheck);
    document.querySelector('.decrease').addEventListener('click', onDecrease);
    document.querySelector('.increase').addEventListener('click', onIncrease);

    //Text Align Events
    const alignBtns = document.querySelectorAll('.align');
    alignBtns.forEach(btn => { btn.addEventListener('click', onAlignText); });

    // Fonts Events
    document.querySelector('select[name="font-options"]').addEventListener('click', onFontChangeBtn);
    document.querySelector('.color').addEventListener('change', onColorChangeBtn);
    document.querySelector('.stroke').addEventListener('change', onStrokeChangeBtn);

    //Movement 
    document.querySelector('.up').addEventListener('click', onUpBtn);
    document.querySelector('.down').addEventListener('click', onDownBtn);
    document.querySelector('.left').addEventListener('click', onLeftBtn);
    document.querySelector('.right').addEventListener('click', onRightBtn);
    //save
    document.querySelector('.save-meme').addEventListener('click', onSaveBtn);

    //NEW LINE
    document.querySelector('.add-line').addEventListener('click', onNewLineBtn);
    document.querySelector('.change-text').addEventListener('click', onNextLineBtn);
    // trash
    document.querySelector('.remove-txt').addEventListener('click', onTrash);





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

function onCloseEditorBtn() {
    hide(document.querySelector('.canvas-editor'));
    document.querySelector('.filter').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'block';
    resetVaribles();
    renderImages();

}

function canvasInit() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
}

function resizeCanvas() {
    const elWidthContainer = document.querySelector('.canvas-options');
    const elHeightContainer = document.querySelector('.canvas-options');
    gElCanvas.width = elWidthContainer.offsetWidth + 150;
    gElCanvas.height = elHeightContainer.offsetHeight;
}

function downloadImg(ev) {
    let { meme } = getMeme();
    isDownload = true;
    renderCanvas(meme);
    setTimeout(() => {
        ev.target.href = gElCanvas.toDataURL('image/jpeg');
        ev.target.download = "my-meme";
        isDownload = false;
        renderCanvas(meme);
    }, 800)
}

function renderCanvas(meme) {
    drawImg(meme);
}

function drawImg(meme) {

    let img = new Image()
    img.src = meme.image;
    img.onload = () => {
        resizeCanvas();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText();
    }
}

function drawText() {
    let { meme, idx } = getMeme();
    let fillStyle = isDownload ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.3)';
    meme.lines.forEach(line => {
        gCtx.lineWidth = 1;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.stroke;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = `${line.align}`;
        gCtx.fillText(line.txt, line.x, line.y);
        gCtx.strokeText(line.txt, line.x, line.y);
        // heighlighting the current txt
        if (meme.lines[idx]) {
            let currSize = meme.lines[idx].size;
            let canvasWidth = gElCanvas.width;
            gCtx.fillStyle = fillStyle;
            gCtx.fillRect(0, meme.lines[idx].y - currSize + 2, canvasWidth, currSize);
        }
    })
}

function onTextInput(ev) {
    document.querySelector('.canvas-options input').focus();
    const memeId = document.querySelector('.canvas-options input').dataset.id;
    let meme = getMameById(memeId);
    let txt = ev.target.value;
    updateMemeText(txt, meme, meme.selectedLineIdx);
    renderCanvas(meme);

}

function onDecrease() {
    let { meme, idx } = getMeme();
    if (meme.lines[idx].size > 16) meme.lines[idx].size--;
    renderCanvas(meme);
}

function onIncrease() {
    let { meme, idx } = getMeme();
    if (meme.lines[idx].size < 100) meme.lines[idx].size++;
    renderCanvas(meme);
}

function onAlignText(ev) {
    let align = ev.target.dataset.text;
    let { meme, idx } = getMeme();
    meme.lines[idx].align = align;
    renderCanvas(meme);
}

function onFontChangeBtn(ev) {
    let fontText = ev.target.value;
    let { meme, idx } = getMeme();
    meme.lines[idx].font = fontText;
    renderCanvas(meme);
}

function onColorChangeBtn(ev) {
    let textColor = ev.target.value;
    let { meme, idx } = getMeme();
    meme.lines[idx].color = textColor;
    renderCanvas(meme);
}

function onStrokeChangeBtn(ev) {
    let stroke = ev.target.value;
    let { meme, idx } = getMeme();
    meme.lines[idx].stroke = stroke;
    renderCanvas(meme);
}

function getMeme() {
    let memeId = document.querySelector('.canvas-options input').dataset.id;
    let meme = getMameById(memeId);
    let idx = meme.selectedLineIdx;
    return {
        idx: idx,
        meme: meme
    }
}

function onUpBtn() {
    let { meme, idx } = getMeme();
    if (meme.lines[idx].y < (0 + meme.lines[idx].size)
        || meme.lines[idx].y > gElCanvas.height + meme.lines[idx].size) return
    meme.lines[idx].y -= 5;
    renderCanvas(meme)


}

function onDownBtn() {
    let { meme, idx } = getMeme();
    if (meme.lines[idx].y < meme.lines[idx].size
        || meme.lines[idx].y > gElCanvas.height - meme.lines[idx].size) return
    meme.lines[idx].y += 5;
    renderCanvas(meme)
}

function onRightBtn() {
    let { meme, idx } = getMeme();
    if (meme.lines[idx].x < (0 + meme.lines[idx].size)
        || meme.lines[idx].x > gElCanvas.width + meme.lines[idx].size) return
    meme.lines[idx].x -= 5;
    renderCanvas(meme)

}

function onLeftBtn() {
    let { meme, idx } = getMeme();
    if (meme.lines[idx].x < (0 + meme.lines[idx].size)
        || meme.lines[idx].x > gElCanvas.width + meme.lines[idx].size) return
    meme.lines[idx].x += 5;
    renderCanvas(meme)

}

function onSaveBtn() {
    let { meme } = getMeme();
    saveMeme(gElCanvas.toDataURL('image/jpeg'), meme.selectedImgId);
    const modal = document.querySelector('.save-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 800);

}

function resetVaribles() {
    document.querySelector('.canvas-options input').value = '';
}

function onNewLineBtn() {
    let { meme } = getMeme();
    addLine(meme);
    resetVaribles();
    onNextLineBtn();
}

function onNextLineBtn() {
    let { meme } = getMeme();
    resetVaribles();
    nextLine(meme)
    renderCanvas(meme);
}

function onTrash() {
    let memeData = getMeme();
    removeLine(memeData);
    resetVaribles();
    renderCanvas(memeData.meme)
}

function onLineCheck() {
    let { meme } = getMeme();
    if (!meme.lines.length) onNewLineBtn();
}

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