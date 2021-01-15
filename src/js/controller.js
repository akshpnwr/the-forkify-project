import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');
const inputSearch = document.querySelector('.search__field');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) module.hot.accept();

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPerPage());
    bookmarkView.update(model.state.bookmarks);
    //1. Load recipe
    await model.loadRecipe(id);

    //2. render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Render spinner
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    //1. get data
    await model.loadSearchResults(query);

    //2. render results
    // resultsView.render(model.state.search.results);
    renderResults();
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (btn) {
  if (btn.classList.contains('pagination__btn--prev'))
    model.state.search.page--;

  if (btn.classList.contains('pagination__btn--next'))
    model.state.search.page++;

  renderResults();
};

const renderResults = function () {
  resultsView.render(model.getSearchResultsPerPage(model.state.search.page));
  paginationView.render(model.state.search);
};

const conrtolServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  //2) Render bookmark icon

  recipeView.update(model.state.recipe);

  //3) Render bookmark

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipeView = async function (newRecipe) {
  try {
    await model.addRecipeView(newRecipe);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const welcomeMessage = function () {
  console.log('Welcome to the website.');
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(conrtolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipeView);
  welcomeMessage();
};
init();
