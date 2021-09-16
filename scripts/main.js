// Set 'use strict' eslint error to work globally in config
'use strict';
const DETAIL_IMAGE_SELECTOR = '[data-image-role="target"]';
const DETAIL_TITLE_SELECTOR = '[data-image-role="title"]';
const DETAIL_FRAME_SELECTOR = '[data-image-role="frame"]';
const THUMBNAIL_LINK_SELECTOR = '[data-image-role="trigger"]';
const HIDDEN_DETAIL_CLASS = 'hidden-detail';
const TINY_EFFECT_CLASS = 'is-tiny';
const ESC_KEY = 27;
const RIGHT_ARROW_KEY = 39;
const LEFT_ARROW_KEY = 37;
const UL = document.querySelector('.thumbnail-list');
let parentElement;

const setDetails = (imageUrl, titleText) => {
    let detailImage = document.querySelector(DETAIL_IMAGE_SELECTOR);
    detailImage.setAttribute('src', imageUrl);

    let detailTitle = document.querySelector(DETAIL_TITLE_SELECTOR);
    detailTitle.textContent = titleText;
};

const imageFromThumb = (thumbnail) => thumbnail.getAttribute('data-image-url');

const titleFromThumb = (thumbnail) => thumbnail.getAttribute('data-image-title');

const getCurrentDetailImg = () => document.getElementsByClassName('detail-image')[0].getAttribute('src');

const setDetailsFromThumb = (thumbnail) => {
    setDetails(imageFromThumb(thumbnail), titleFromThumb(thumbnail));
    // Whenever new detail thumbnail is set update parentElement with new thumbnail element
    parentElement = thumbnail.parentElement;
};

const addThumbClickHandler = (thumb) => {
    // On first load set the parentElement to be the matching element src
    if (getCurrentDetailImg() === thumb.firstElementChild.getAttribute('src')) {
        parentElement = thumb.parentElement;
    }

    thumb.addEventListener('click', (e) => {
        e.preventDefault();
        setDetailsFromThumb(thumb);
        showDetails();
    });
};

const getThumbnailsArray = () => {
    let thumbnails = document.querySelectorAll(THUMBNAIL_LINK_SELECTOR);
    // Since thumbnails returns as NodeLists [].slice.call === Array.prototype.slice.call will convert Array-like objects to a new Array
    return [].slice.call(thumbnails);
};

const hideDetails = () => {
    document.body.classList.add(HIDDEN_DETAIL_CLASS);
};

const showDetails = () => {
    let frame = document.querySelector(DETAIL_FRAME_SELECTOR);
    document.body.classList.remove(HIDDEN_DETAIL_CLASS);
    frame.classList.add(TINY_EFFECT_CLASS);
    setTimeout(() => {
        frame.classList.remove(TINY_EFFECT_CLASS);
    }, 50);
};

const addKeyPressHandler = () => {
    document.body.addEventListener('keyup', (e) => {
        e.preventDefault();
        console.log(e.keyCode);
        if (e.keyCode === ESC_KEY) {
            hideDetails();
        } else if (e.keyCode === RIGHT_ARROW_KEY) {
            onClickNext();
        } else if (e.keyCode === LEFT_ARROW_KEY) {
            onClickPrev();
        }
    });
};

const onClickNext = () => {
    // Check if parent element has next element sibling and set thumb details for siblings first child element
    if (parentElement?.nextElementSibling?.firstElementChild) {
        setDetailsFromThumb(parentElement.nextElementSibling.firstElementChild);
    } else {
        // Reached end of list so grab first child element in ul and set first element in the list item
        setDetailsFromThumb(UL.firstElementChild.firstElementChild);
    }
};

const onClickPrev = () => {
    // Check if parent element has previous element sibling and set thumb details for siblings first child element
    if (parentElement?.previousElementSibling?.firstElementChild) {
        setDetailsFromThumb(parentElement.previousElementSibling.firstElementChild);
    } else {
        // Reached beginning of list so grab last child element in ul and set first element in list item
        setDetailsFromThumb(UL.lastElementChild.firstElementChild);
    }
};

const initializeEvents = () => {
    let thumbnails = getThumbnailsArray();
    thumbnails.forEach(addThumbClickHandler);
    addKeyPressHandler();
    document.getElementById('nextButton').onclick = onClickNext;
    document.getElementById('prevButton').onclick = onClickPrev;
};

initializeEvents();