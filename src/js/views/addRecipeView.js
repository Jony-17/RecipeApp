import View from "./View";
import icons from "url:../../img/icons.svg"; // Importa os icons

// Classe responsável por adicionar novas receitas
class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
    //this.addHandlerUpload();
  }

  // Alterna a visibilidade da janela de upload e do overlay
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  // Quando o botão é clicado para abrir, chama o método toggleWindow
  addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  // Quando o botão é clicado para fechar, chama o método toggleWindow
  addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  // Processo de upload das receitas
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      // Cria um array a partir dos dados do formulário
      const dataArr = [...new FormData(this)];
      // Converte o array de dados num objeto
      const data = Object.fromEntries(dataArr);

      // Chama a função com os dados como argumento
      handler(data);
    });
  }

  generateMarkup() {}
}

export default new AddRecipeView();
