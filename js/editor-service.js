'use strict';

let gMemes = [];

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
    var elWidthContainer = document.querySelector('.canvas-main');
    var elHeightContainer = document.querySelector('.editor-container');
    gCanvas.width = elWidthContainer.offsetWidth;
    gCanvas.height = elHeightContainer.offsetHeight;
}

function _createMeme(image) {
    return {
        selectedImgId: image.id,
        selectedLineIdx: 0,
        image: image.image,
        lines: [_createLine()],
    }
}

function _createLine() {
    return {
        txt: '',
        size: 40,
        align: 'left',
        color: 'white',
        stroke: 'black',
        font: 'Impact',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2,
    }

}

function getMameById(id) {
    if (gMemes.length === 1) return gMemes[0];
    return gMemes.find(meme => {
        return meme.selectedImgId === id;
    });
}
