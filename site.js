'use strict';

const frames = Array.from(document.querySelectorAll('.frame'));
const filters = document.querySelector('.filters');
const filterButtons = Array.from(filters.querySelectorAll('button'));
const galleryStatus = document.querySelector('#gallery-status');
const viewer = document.querySelector('#lightbox');
const largePhoto = document.querySelector('#large-photo');
const photoCount = document.querySelector('#photo-count');
const photoTitle = document.querySelector('#photo-title');
const photoDescription = document.querySelector('#photo-description');
const viewerArrows = Array.from(viewer.querySelectorAll('[data-step]'));
let visibleFrames = frames;
let currentPhoto = 0;
let opener;

filters.hidden = false;
filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;

    const category = button.dataset.filter;
    for (const option of filterButtons) {
        option.setAttribute('aria-pressed', String(option === button));
    }
    visibleFrames = frames.filter((frame) => {
        frame.hidden = category !== 'All' && frame.dataset.category !== category;
        return !frame.hidden;
    });
    galleryStatus.textContent = `${visibleFrames.length} photographs displayed.`;
});

function showPhoto(index) {
    currentPhoto = (index + visibleFrames.length) % visibleFrames.length;
    const frame = visibleFrames[currentPhoto];
    const description = frame.querySelector('img').alt;
    largePhoto.alt = description;
    photoDescription.textContent = description;
    largePhoto.src = frame.querySelector('a').href;
    photoTitle.textContent = frame.querySelector('figcaption span').textContent;
    photoCount.textContent = `${currentPhoto + 1} / ${visibleFrames.length}`;
    for (const arrow of viewerArrows) {
        arrow.disabled = visibleFrames.length < 2;
    }
}

document.querySelector('.gallery').addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
            typeof viewer.showModal !== 'function') {
        return;
    }
    event.preventDefault();
    opener = link;
    showPhoto(visibleFrames.indexOf(link.closest('.frame')));
    viewer.showModal();
});
viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
    opener?.focus();
});
for (const arrow of viewerArrows) {
    arrow.addEventListener('click', () => showPhoto(currentPhoto + Number(arrow.dataset.step)));
}
viewer.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showPhoto(currentPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
});

function httpsUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

const config = window.eyesOfEthics ?? {};
const checkoutLinks = document.querySelector('#checkout-links');
const squareHosts = ['square.link', 'checkout.square.site'];

for (const order of config.quickOrders ?? []) {
    const url = httpsUrl(order.url);
    if (!order.label || !url || !squareHosts.includes(url.hostname)) {
        continue;
    }

    const card = document.createElement('article');
    const title = document.createElement('h4');
    const link = document.createElement('a');

    title.textContent = order.label;
    card.append(title);

    if (order.description) {
        const description = document.createElement('p');
        description.textContent = order.description;
        card.append(description);
    }

    link.className = 'button';
    link.href = url.href;
    link.textContent = `Pay with Square for ${order.label}`;
    card.append(link);
    checkoutLinks.append(card);
}

if (checkoutLinks.childElementCount) {
    checkoutLinks.hidden = false;
    document.querySelector('#checkout-unavailable').hidden = true;
}

const form = document.querySelector('#inquiry');
const send = document.querySelector('#send-inquiry');
const note = document.querySelector('#form-note');
const unavailable = document.querySelector('#inquiry-unavailable');
let isSending = false;
const endpoint = httpsUrl(config.inquiryEndpoint);

for (const link of document.querySelectorAll('[data-project]')) {
    link.addEventListener('click', () => {
        form.elements.project.value = link.dataset.project;
    });
}

if (endpoint) {
    form.action = endpoint.href;
    send.disabled = false;
    send.removeAttribute('aria-describedby');
    unavailable.hidden = true;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!endpoint || isSending) return;

    isSending = true;
    send.setAttribute('aria-disabled', 'true');
    note.textContent = 'Sending your inquiry…';
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) {
            throw new Error('Submission failed');
        }
        form.reset();
        note.textContent = 'Your inquiry was sent.';
    } catch {
        note.textContent = 'We couldn’t confirm delivery. Your details are still here. Please try again.';
    } finally {
        isSending = false;
        send.removeAttribute('aria-disabled');
    }
});
