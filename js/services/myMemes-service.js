'use strict';

function getSavedMemes() {
    return loadFromStorage(key);
}


function removeMeme(memeId) {
    let memes = getSavedMemes(key)
    const idx = memes.findIndex(meme => { return meme.selectedImgId === memeId });
    memes.splice(idx, 1);
    gMemes = memes;
    saveToStorage(key, memes)
}