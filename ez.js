import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><body><div class="loading-progress"></div></body>`);
const document = dom.window.document;

const loadingText = document.querySelector('.loading-progress');
let loadingProgress = 0;

const loadingInterval = setInterval(() => {
  loadingProgress += Math.random() * 15;
  if (loadingProgress >= 100) {
    loadingProgress = 100;
    clearInterval(loadingInterval);
  }
  loadingText.textContent = `Loading ${Math.floor(loadingProgress)}% complete...`;
  console.log(loadingText.textContent);
}, 100);
