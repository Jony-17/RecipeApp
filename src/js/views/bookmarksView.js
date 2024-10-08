import View from "./View";
import icons from "url:../../img/icons.svg"; // Importa os icons

// Classe responsável pela apresentação dos resultados consoante a pesquisa feita
class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it!";
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  generateMarkup() {
    return this._data.map(this.generateMarkupPreview).join("");
  }

  generateMarkupPreview(result) {
    return `
    <li class="preview">
        <a class="preview__link preview__link" href="#${result.id}">
            <figure class="preview__fig">
            <img src="${result.image}" alt="${result.image}" />
            </figure>
            <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            </div>
        </a>
    </li>
    `;
  }
}

export default new BookmarksView();
