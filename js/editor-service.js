'use strict';
const key = 'Memes';

let gMemes = [];


function getMemes() {
    return gMemes;
}

function createMemes(imgId) {
    let image = getImageById(imgId);
    let meme = _createMeme(image)
    gMemes.push(meme);
    return meme.selectedImgId;
}

function createLines(meme) {
    meme.lines.push(_createLine());
}

function updateMemeText(txt, meme, lineNum = 0) {
    meme.lines[lineNum].txt = txt;
}

function _createMeme(image) {
    return {
        selectedImgId: makeId(),
        selectedLineIdx: 0,
        image: image.image,
        lines: [],
        isDragged: false,
        savedImageUrl: ''
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

function saveMeme(memeImgUrl, memeId) {
    let meme = getMameById(memeId);
    meme.savedImageUrl = memeImgUrl;
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