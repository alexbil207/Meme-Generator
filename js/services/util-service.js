'use strict';

function makeId(length = 10) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function showHidden(element) {
    element.classList.add('show');
}
function hide(element) {
    element.classList.remove('show');
}

