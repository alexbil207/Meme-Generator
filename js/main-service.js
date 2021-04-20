'use strict';

const PAGE_SIZE = 10;
let gPageIdx = 0;
let isPageNav = true;
let gImagesNum;

function getFilters() {
    return filtersCollect();
}

function getImages(filter) {
    let images;
    if (filter === 'all') {
        images = gImages.slice()
    } else {
        images = gImages.filter(image => { return image.category.includes(filter) })
    }
    isPageNav = images.length > PAGE_SIZE;
    if (isPageNav) {
        gImagesNum = images.length;
        let startIdx = gPageIdx * PAGE_SIZE;
        return images.slice(startIdx, startIdx + PAGE_SIZE);
    }
    return images;
}

function filtersCollect() {
    let filters = [];
    gImages.forEach(image => {
        return image.category.forEach(category => {
            if (filters.includes(category)) return
            filters.push(category);
        })
    })
    return filters;
}

function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= gImagesNum) {
        gPageIdx = 0;
    }
}

function backPage() {
    if (!gPageIdx) return
    gPageIdx--;
}

function getPageNum() {
    return gPageIdx;
}

function getImageById(id) {
    return gImages.find(image => {
        return image.id === id;
    });
}
