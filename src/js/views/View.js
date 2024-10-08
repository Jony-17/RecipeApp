import icons from "url:../../img/icons.svg"; // Importa os icons

// Classe principal responsável por todas as views
export default class View {
  _data; // armazena os dados da receita

  // Método render que recebe os dados da receita e atualiza a interface
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Armazena os dados recebidos na propriedade privada
    this._data = data;

    // Chama o método privado generateMarkup()
    const markup = this.generateMarkup();
    // recipeContainer.innerHTML = "";

    // Chama o método privado clear
    this._clear();

    // Insere a marcação
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Método clear responsável por limpar o conteúdo do container
  _clear() {
    this._parentElement.innerHTML = "";
  }

  // Método renderSpinner responsável por exibir um indicador de carregamento enquanto os dados são carregados
  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
          `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Método renderError responsável por exibir uma mensagem de erro
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Método renderMessage responsável por exibir uma mensagem de sucesso
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
