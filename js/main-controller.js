'use strict';

let gFilter;
let gInput = '';
let gElCanvas;
let gCtx;
let gText = [];


window.addEventListener('load', onInit);


function onInit() {
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
    // document.querySelector('.my-memes-btn').addEventListener('click', onMyMemes);
    document.querySelector('.toggle-menu-btn').addEventListener('click', onMenuBtn);
    document.querySelector('.filter-menu-btn').addEventListener('click', onFilterMenuBtn);
    document.querySelector('input[id="search"]').addEventListener('input', onSearchInput, this);
    document.querySelector('.close-editor').addEventListener('click', onCloseEditorBtn);
    setFilterEvents();
    setImagesEvents();
    setCanvasEvents();

}
//filter listeners
function setFilterEvents() {
    let elFilterBtns = document.querySelectorAll('.filter-btn');
    elFilterBtns.forEach(btn => { btn.addEventListener('click', onFilterBtn, this); })
}
//images grid listeners
function setImagesEvents() {
    let elImages = document.querySelectorAll('.card-img');
    elImages.forEach(image => { image.addEventListener('click', onImageBtn, this); })
}
// canvas Editor Events
function setCanvasEvents() {
    document.querySelector('.control-editor-btns a').addEventListener('click', downloadImg, this);
    document.querySelector('.canvas-options input').addEventListener('input', onTextInput, this);
    document.querySelector('.canvas-options input').addEventListener('click', onLineCheck);
    document.querySelector('.decrease').addEventListener('click', onDecrease);
    document.querySelector('.increase').addEventListener('click', onIncrease);

    //Text Align Events
    let alignBtns = document.querySelectorAll('.align');
    alignBtns.forEach(btn => {
        btn.addEventListener('click', onAlignText, this);
    })
    // Fonts Events
    document.querySelector('select[name="font-options"]').addEventListener('click', onFontChangeBtn, this);
    document.querySelector('.color').addEventListener('change', onColorChangeBtn, this);
    document.querySelector('.stroke').addEventListener('change', onStrokeChangeBtn, this);

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
    hide(document.querySelector('.canvas-editor'))
    onInit();
}


function onFilterBtn(btn) {
    let elMenu = document.querySelector('.filter-list');
    let menuBtn = document.querySelector('.filter-menu-btn');

    if (elMenu.classList.value.includes('show')) toggleMenu(menuBtn, 'Filters', '✖', elMenu);
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

function onImageBtn(elImage) {
    let imgId = elImage.target.dataset.id;
    document.querySelector('.canvas-options input').setAttribute("data-id", imgId);
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    showHidden(document.querySelector('.canvas-editor'))
    createMemes(imgId);
    let meme = getMameById(imgId)
    renderCanvas(meme);

}

function onMenuBtn() {
    let menuBtn = document.querySelector('.toggle-menu-btn');
    let elMenu = document.querySelector('.nav-btns');
    toggleMenu(menuBtn, '☰', '✖', elMenu)
}

function onFilterMenuBtn() {
    let menuBtn = document.querySelector('.filter-menu-btn');
    let elMenu = document.querySelector('.filter-list');
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
    if (input.data) {
        gInput += input.data;
        renderImages(gInput);
    } else {
        gInput = '';
        renderImages();
    }

}

function onCloseEditorBtn() {
    hide(document.querySelector('.canvas-editor'));
    document.querySelector('.filter').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'block';
    resetVaribles();

}

function canvasInit() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
}

function downloadImg(elLink) {
    elLink.target.href = gElCanvas.toDataURL();
    elLink.target.download = "my-meme"
}

function renderCanvas(image) {
    let meme = getMameById(image.id);
    drawImg(image, meme);
}

function drawImg(image) {
    let img = new Image()
    img.src = image.image;
    img.onload = () => {
        resizeCanvas();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText();
    }
}

function drawText() {
    let memeData = getMeme();
    memeData.meme.lines.forEach(line => {
        gCtx.lineWidth = 1;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.stroke;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = `${line.align}`;
        gCtx.fillText(line.txt, line.x, line.y);
        gCtx.strokeText(line.txt, line.x, line.y);
        // heighlighting the current txt
        let idx = memeData.idx;
        if (memeData.meme.lines[idx]) {
            let currSize = memeData.meme.lines[idx].size;
            let canvasWidth = gElCanvas.width;
            gCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            gCtx.fillRect(0, memeData.meme.lines[idx].y - currSize + 2, canvasWidth, currSize);
        }
    })
}

function onTextInput(input) {
    document.querySelector('.canvas-options input').focus();
    let memeId = document.querySelector('.canvas-options input').dataset.id;
    let meme = getMameById(memeId);
    let txt = input.target.value;
    updateMemeText(txt, meme, meme.selectedLineIdx);
    renderCanvas(meme);

}

function onDecrease() {
    let memeData = getMeme();
    if (memeData.meme.lines[memeData.idx].size > 16) memeData.meme.lines[memeData.idx].size--;
    renderCanvas(memeData.meme);
}

function onIncrease() {
    let memeData = getMeme();
    let meme = memeData.meme;
    let idx = memeData.idx;
    if (memeData.meme.lines[memeData.idx].size < 100) memeData.meme.lines[memeData.idx].size++;
    renderCanvas(memeData.meme);
}

function onAlignText(btn) {
    let align = btn.target.dataset.text;
    let memeData = getMeme();
    memeData.meme.lines[memeData.idx].align = align;
    renderCanvas(memeData.meme);
}

function onFontChangeBtn(font) {
    let fontText = font.target.value;
    let memeData = getMeme();
    memeData.meme.lines[memeData.idx].font = fontText;
    renderCanvas(memeData.meme);
}

function onColorChangeBtn(color) {
    let textColor = color.target.value;
    let memeData = getMeme();
    memeData.meme.lines[memeData.idx].color = textColor;
    renderCanvas(memeData.meme);
}

function onStrokeChangeBtn(color) {
    let stroke = color.target.value;
    let memeData = getMeme();
    memeData.meme.lines[memeData.idx].stroke = stroke;
    renderCanvas(memeData.meme);
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
    let memeData = getMeme();
    if (memeData.meme.lines[memeData.idx].y < (0 + memeData.meme.lines[memeData.idx].size)
        || memeData.meme.lines[memeData.idx].y > gElCanvas.height + memeData.meme.lines[memeData.idx].size) return
    memeData.meme.lines[memeData.idx].y -= 5;
    renderCanvas(memeData.meme)


}

function onDownBtn() {
    let memeData = getMeme();
    if (memeData.meme.lines[memeData.idx].y < (0 + memeData.meme.lines[memeData.idx].size)
        || memeData.meme.lines[memeData.idx].y > gElCanvas.height + memeData.meme.lines[memeData.idx].size) return
    memeData.meme.lines[memeData.idx].y += 5;
    renderCanvas(memeData.meme)
}

function onRightBtn() {
    let memeData = getMeme();
    if (memeData.meme.lines[memeData.idx].x < (0 + memeData.meme.lines[memeData.idx].size)
        || memeData.meme.lines[memeData.idx].x > gElCanvas.width + memeData.meme.lines[memeData.idx].size) return
    memeData.meme.lines[memeData.idx].x -= 5;
    renderCanvas(memeData.meme)

}

function onLeftBtn() {
    let memeData = getMeme();
    if (memeData.meme.lines[memeData.idx].x < (0 + memeData.meme.lines[memeData.idx].size)
        || memeData.meme.lines[memeData.idx].x > gElCanvas.width + memeData.meme.lines[memeData.idx].size) return
    memeData.meme.lines[memeData.idx].x += 5;
    renderCanvas(memeData.meme)

}

function onSaveBtn() {
    saveMeme();
    let modal = document.querySelector('.canvas-options p');
    modal.innerText = 'Saved!';
    setTimeout(() => {
        modal.innerText = '';
    }, 1000);
}

function resetVaribles() {
    document.querySelector('.canvas-options input').value = '';
}

function onNewLineBtn() {
    let memeData = getMeme();
    addLine(memeData.meme);
    resetVaribles();
    onNextLineBtn();
}

function onNextLineBtn() {
    let memeData = getMeme();
    resetVaribles();
    nextLine(memeData.meme)
    renderCanvas(memeData.meme);
}

function onTrash() {
    let memeData = getMeme();
    removeLine(memeData);
    resetVaribles();
    renderCanvas(memeData.meme)
}

function onLineCheck() {
    let memeData = getMeme();
    if (!memeData.meme.lines.length) onNewLineBtn();
}

function onMyMemes() {
    showHidden(document.querySelector('.saved-memes'));
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
}

