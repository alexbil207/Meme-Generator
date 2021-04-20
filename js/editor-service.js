'use strict';

let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines:
        [
            {
                txt: 'Text',
                size: 16,
                align: 'left',
                color: 'black',
                x: 0,
                y: 0,
            }
        ]
}


function drawImg(elImage) {
    let img = new Image()
    img.src = elImage.image;
    img.onload = () => {
        resizeCanvas();
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}


function resizeCanvas() {
    var elWidthContainer = document.querySelector('.canvas-main');
    var elHeightContainer = document.querySelector('.editor-container');
    gCanvas.width = elWidthContainer.offsetWidth;
    gCanvas.height = elHeightContainer.offsetHeight;
}

