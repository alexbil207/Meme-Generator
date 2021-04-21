'use strict';

let gMemes = [];

const key = 'Memes';

function getMemes() {
    return gMemes;
}

function createMemes(imgId) {
    let image = getImageById(imgId, gImages);
    gMemes.push(_createMeme(image));
}

function createLines(meme) {
    meme.lines.push(_createLine());
}

function updateMemeText(text, meme, lineNum = 0) {
    meme.lines[lineNum].txt = text;
}

function resizeCanvas() {
    var elWidthContainer = document.querySelector('.canvas-options');
    var elHeightContainer = document.querySelector('.canvas-options');
    gElCanvas.width = elWidthContainer.offsetWidth + 100;
    gElCanvas.height = elHeightContainer.offsetHeight;
}

function _createMeme(image) {
    return {
        selectedImgId: image.id,
        selectedLineIdx: 0,
        image: image.image,
        lines: [_createLine()],
        isDragged: false
    }
}

function _createLine() {
    return {
        txt: '',
        size: 40,
        align: 'center',
        color: 'white',
        stroke: 'black',
        font: 'Impact',
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2,
    }

}

function getMameById(id) {
    if (gMemes.length === 1) return gMemes[0];
    return gMemes.find(meme => {
        return meme.selectedImgId === id;
    });
}

function saveMeme() {
    saveToStorage(key, gMemes);
}

function addLine(meme) {
    meme.lines.push(_createLine());
}

function nextLine(meme) {
    meme.selectedLineIdx++;
    if (meme.selectedLineIdx > meme.lines.length - 1) meme.selectedLineIdx = 0;
}

function removeLine(memeData) {
    memeData.meme.lines.splice(memeData.idx, 1);
}