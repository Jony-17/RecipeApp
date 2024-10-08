import View from "./View";
import icons from "url:../../img/icons.svg"; // Importa os icons

// Classe responsável pela apresentação dos resultados consoante a pesquisa feita
class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query. Please try again!";
  _message = "";

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

export default new ResultsView();
