// View (lógica da apresentação)

import View from "./View";

import icons from "url:../../img/icons.svg"; // Importa os icons
import { Fraction } from "fractional"; // Importa uma biblioteca para lidar com frações

// Classe responsável por toda a lógica da apresentação da receita
class RecipeView extends View {
  // Propriedades privadas que são apenas acessíveis dentro da classe
  _parentElement = document.querySelector(".recipe"); // elemento do DOM que representa o container onde a receita será renderizada
  _errorMessage = "We could not find that recipe. Please try another one!";
  _message = "";

  // Método addHandlerRender responsável por ser chamado sempre que o hash na URL mudar
  addHandlerRender(handler) {
    // Caso o utilizador mude de receita, o evento irá ser chamado
    ["hashchange", "load"].forEach(function (ev) {
      window.addEventListener(ev, handler);
    });

    // ["hashchange", "load"].forEach(function (ev) {
    //   window.addEventListener(ev, controlRecipes);
    // });

    // o mesmo que estas duas linhas
    // window.addEventListener("hashchange", controlRecipes);
    // window.addEventListener("load", controlRecipes);
  }

  // Método addHandlerUpdateServings responsável por atualizar as porções
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;
      console.log(btn);

      const updateTo = +btn.dataset.updateTo;
      console.log(updateTo);

      if (updateTo > 0) {
        handler(updateTo);
      }
    });
  }

  // Método addHandlerAddBookmark responsável por adicionar as receitas aos favoritos
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      console.log(btn);
      handler();
    });
  }

  // Método privado generateMarkup responsável por gerar a marcação HTML para a receita consoante os dados armazenados em #data
  generateMarkup() {
    // console.log(this_data);
    return `
      <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings - 1
                }">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${
                  this._data.servings + 1
                }">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated ${
              this._data.key ? "" : "hidden"
            }">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>

            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this.generateMarkupIngredient)
              .join("")} 
            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                this._data.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${this._data.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
        `;
  }
  generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new Fraction(ing.quantity).toString() : ""
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
  `;
  }
}

// Exportação da classe com o intuito do controller utilizá-la
export default new RecipeView();
