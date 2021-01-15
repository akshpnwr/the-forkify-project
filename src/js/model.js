import { API_URL_GET, API_URL_SEARCH, RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  servings: 4,
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL_GET}${id}`);

    const { recipe } = data;

    state.recipe = {
      id: recipe.recipe_id,
      title: recipe.title,
      publisher: recipe.publisher,
      imageUrl: recipe.image_url,
      sourceUrl: recipe.source_url,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.page = 1;
    state.search.query = query;
    const data = await getJSON(`${API_URL_SEARCH}${query}`);

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.recipe_id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients = state.recipe.ingredients.map(ing => {
    let newIng = ing.split(' ').slice(0, 1);
    newIng = (newIng * newServings) / state.servings;

    if (!isNaN(newIng)) ing = `${newIng}${ing.slice(1)}`;
    return ing;
  });
  state.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const deleteBookmark = function (id) {
  state.bookmarks.splice(
    state.bookmarks.findIndex(bookmark => bookmark.id === id),
    1
  );
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

export const addRecipeView = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1])
      .map(ing => {
        const ingArr = ing[1].split(',');

        if (ingArr.length < 3)
          throw new Error('Wrong input format! Please use correct format.');

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      ingredients,
    };
  } catch (err) {
    throw err;
  }
};
const init = function () {
  const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if (storedBookmarks) state.bookmarks = storedBookmarks;
};

init();
