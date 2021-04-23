'use strict';



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
    let { meme } = getMeme();
    isDownload = true;
    renderCanvas(meme);
    setTimeout(() => {
        ev.target.href = gElCanvas.toDataURL('image/jpeg');
        ev.target.download = "my-meme";
        isDownload = false;
        renderCanvas(meme);
    }, 500)
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

function onCloseEditorBtn() {
    hide(document.querySelector('.canvas-editor'));
    document.querySelector('.filter').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'block';
    resetVaribles();
    renderImages();

}