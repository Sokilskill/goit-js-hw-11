import NewsApiService from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'; // Додатковий імпорт стилів
import scrollToTop from './scroll-to-top';

const newsApiService = new NewsApiService(); //Класс з методами

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

const perPage = newsApiService.perPage;
let score = perPage;

formEl.addEventListener('submit', handlerSubmitForm);

async function handlerSubmitForm(ev) {
  ev.preventDefault();
  galleryEl.innerHTML = '';
  hiddenEl(btnLoadMoreEl);
  score = perPage;

  newsApiService.query = ev.currentTarget.searchQuery.value;
  newsApiService.resetPageToDefault();

  try {
    const data = await newsApiService.fetchSearch();
    if (parseInt(data.totalHits) <= 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    createRenderMarkup(data.hits);
    if (data.totalHits > perPage) showEl(btnLoadMoreEl);
  } catch (error) {
    Notify.failure(`${error}`);
    console.log(error);
  }
  formEl.reset();
}

function createRenderMarkup(arr) {
  createMarkup(arr);
  lightbox.refresh();
}

function createMarkup(arr) {
  galleryEl.insertAdjacentHTML(
    'beforeend',
    arr
      .map(
        el =>
          `<div class="wrapper-image">
          <a class="gallery__link" href="${el.largeImageURL}">
            <div class="gallery__thumb">
              <img class="gallery__image" src="${el.webformatURL}" alt="${el.tags}" loading="lazy"/>
            </div>
          </a>
          <div class="info">
            <p class="info-item"><b>Likes  </b>${el.likes}</p>
            <p class="info-item"><b>Views </b>${el.views} </p>
            <p class="info-item"><b>Comments </b>${el.comments} </p>
            <p class="info-item"><b>Downloads</b> ${el.downloads}</p>
          </div>
        </div>`
      )
      .join(' ')
  );
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.93,
  swipeTolerance: 400,
  // showCounter: false,
});

btnLoadMoreEl.addEventListener('click', fetchLoadMore);

async function fetchLoadMore() {
  newsApiService.incrementPage();
  const data = await newsApiService.fetchSearch();
  try {
    createRenderMarkup(data.hits);
    score += data.hits.length;

    // console.log(  'data.hits: ',
    //   data.hits.length, 'page: ', newsApiService.page,
    //   'total: ',  score
    // );
    smoothPageScrolling();

    if (score >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return hiddenEl(btnLoadMoreEl);
    }
  } catch (error) {
    Notify.failure(`${error}`);
    console.log(error);
  }
}

function hiddenEl(element) {
  element.classList.add('is-hidden');
}

function showEl(element) {
  element.classList.remove('is-hidden');
}

//Плавна прокрутка після завантаження нових зображень
function smoothPageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
  });
}
