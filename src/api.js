import axios from 'axios';

const API_KEY = '38642451-6ca93df2512694306dc1a1cd7';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  fetchSearch() {
    console.log(this.searchQuery);
    console.log(this.page);

    return axios
      .get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      )
      .then(response => {
        return response.data;
      });
  }

  resetPageToDefault() {
    this.page = 1;
  }
  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
