'use strict';

let gFilter;
let gElCanvas;
let gCtx;
let isDownload = false;

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
    alignBtns.forEach(btn => {
        btn.addEventListener('click', onAlignText, this);
    })
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
    hide(document.querySelector('.canvas-editor'))
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
    document.querySelector('.canvas-options input').setAttribute("data-id", imgId);
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    showHidden(document.querySelector('.canvas-editor'))
    createMemes(imgId);
    let meme = getMameById(imgId)
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

}

function canvasInit() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
}

function resizeCanvas() {
    const elWidthContainer = document.querySelector('.canvas-options');
    const elHeightContainer = document.querySelector('.canvas-options');
    gElCanvas.width = elWidthContainer.offsetWidth + 100;
    gElCanvas.height = elHeightContainer.offsetHeight;
}

function downloadImg(ev) {
    ev.target.href = gElCanvas.toDataURL();
    ev.target.download = "my-meme";
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
            gCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            gCtx.fillRect(0, memeData.meme.lines[idx].y - currSize + 2, canvasWidth, currSize);
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
    saveMeme();
    const modal = document.querySelector('.canvas-options p');
    modal.innerText = 'Saved!';
    setTimeout(() => {
        modal.innerText = '';
    }, 1000);
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
    showHidden(document.querySelector('.saved-memes'));
    document.querySelector('.filter').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
}

