import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import '../css/styles.css';

const DEBOUNCE_DELAY = 300;

const cardContainer = document.querySelector('.country-info');
const listContainer = document.querySelector('.country-list');
const inputEl = document.querySelector('input#search-box');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const searchQuery = inputEl.value.trim();
  fetchCountries(searchQuery)
    .then(data => {
      clearContainers();

      if (data.length === 1) {
        resetInput();
        return renderCountryCard(data);
      } else if (data.length >= 2 && data.length <= 10) {
        return renderCountriesList(data);
      }
      return Notify.info('Too many matches found. Please enter a more specific name.');
    })
    .catch(onFetchError);
}

function renderCountryCard([{ flags, name, capital, population, languages }]) {
  cardContainer.innerHTML = `<div class="country-symbolics">
  <img class="country-flag"src="${flags.svg}" alt="country flag" width="40" />
  <h1 class="country-name">${name.official}</h1>
  </div>
        <ul class="country-summary-list">
          <li class="country-summary-item"><b>Capital:</b> ${capital}</li>
          <li class="country-summary-item"><b>Population:</b> ${population}</li>
          <li class="country-summary-item"><b>Languages:</b> ${Object.values(languages).join(
            ', ',
          )}</li>
        </ul>`;
}

function renderCountriesList(arrayOfCountries) {
  for (let i = 0; i < arrayOfCountries.length; i++) {
    const { flags, name } = arrayOfCountries[i];
    const markup = `<li class="country">
      <img class="country-flag"src="${flags.svg}" alt="country flag" width="40" />
  <p class="country-name">${name.common}</p>
  </li>`;
    listContainer.insertAdjacentHTML('beforeend', markup);
  }
}

function onFetchError(error) {
  Notify.failure(`Oops, there is no country with that name`);
  resetInput();
}

function resetInput() {
  inputEl.value = null;
}

function clearContainers() {
  cardContainer.innerHTML = '';
  listContainer.innerHTML = '';
}
