'use strict';

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    let val = localStorage.getItem(key)
    return JSON.parse(val)
}