import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');

  constructor() {
    super();
    this._addHandlerShow();
    this._addHandlerClose();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShow() {
    const btn = document.querySelector('.nav__btn--add-recipe');

    btn.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerClose() {
    const btn = document.querySelector('.btn--close-modal');

    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    btn.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
