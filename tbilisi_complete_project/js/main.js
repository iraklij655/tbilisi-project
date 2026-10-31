'use strict';

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'მენიუს გახსნა');
}

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

const form = document.querySelector('#guide-form');
const message = document.querySelector('#form-message');

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name) {
    message.textContent = 'გთხოვ, შეიყვანე სახელი.';
    form.elements.name.focus();
    return;
  }
  if (!validEmail) {
    message.textContent = 'გთხოვ, შეიყვანე სწორი ელფოსტა.';
    form.elements.email.focus();
    return;
  }
  message.textContent = `მადლობა, ${name}! ფორმა წარმატებით შემოწმდა. ეს დემო ფორმაა და მონაცემები არ იგზავნება.`;
  form.reset();
});

// Slider
const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.querySelector('#dots');
const playButton = document.querySelector('#play');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;
let timer = null;

const dots = slides.map((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot';
  dot.setAttribute('aria-label', `სლაიდი ${index + 1}`);
  dot.addEventListener('click', () => show(index));
  dotsBox.appendChild(dot);
  return dot;
});

function show(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.hidden = i !== current;
    slide.classList.toggle('is-active', i === current);
  });
  dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
}

function start() {
  stop();
  timer = setInterval(() => show(current + 1), 5000);
  playButton.setAttribute('aria-pressed', 'true');
  playButton.textContent = 'პაუზა';
}

function stop() {
  clearInterval(timer);
  timer = null;
  playButton.setAttribute('aria-pressed', 'false');
  playButton.textContent = 'გაგრძელება';
}

document.querySelector('#prev').addEventListener('click', () => show(current - 1));
document.querySelector('#next').addEventListener('click', () => show(current + 1));
playButton.addEventListener('click', () => (timer ? stop() : start()));
show(0);
reduceMotion ? stop() : start();
