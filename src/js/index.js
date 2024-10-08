// Controller (lógica da aplicação)

// import icons from "../img/icons.svg"; // Parcel 1
// import icons from "url:../img/icons.svg"; // Parcel 2

// Import de bibliotecas para garantir que (Promise e async/await) funcionem em navegadores mais antigos
import "core-js/stable"; // Polyfilling para o restante
import "regenerator-runtime/runtime"; // Polyfilling para async/await

import * as model from "./model.js"; // Import de tudo do model
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js"; // Import do módulo recipeView
import searchView from "./views/searchView.js"; // Import do módulo searchView
import resultsView from "./views/resultsView.js"; // Import do módulo resultsView
import paginationView from "./views/paginationView.js"; // Import do módulo paginationView
import bookmarksView from "./views/bookmarksView.js"; // Import do módulo bookmarksView
import addRecipeView from "./views/addRecipeView.js"; // Import do módulo addRecipeView

// if (module.hot) {
//   module.hot.accept();
// }

// Função controlRecipes responsável por carregar e renderizar uma receita
const controlRecipes = async function () {
  try {
    // Extrai o id da receita a partir do hash do URL (o que vem depois de #)
    const id = window.location.hash.slice(1);
    // console.log(`Id: ${id}`);

    // Se o id estiver vazio a função termina
    if (!id) return;
    // Exibe um spinner de carregamento enquanto a receita está a carregar
    recipeView.renderSpinner();

    // 1. Carrega a receita
    await model.loadRecipe(id); // necessita de ser await por se tratar de uma função async vinda do model.js
    // const { recipe } = model.state; // o mesmo que const recipe = model.state.recipe;

    // 2. Renderiza a receita
    recipeView.render(model.state.recipe);

    // const recipeView = new RecipeView(model.state.recipe); dando export da classe, poderia fazer-se desta forma
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

// Chama a função (apenas o controller é responsável por chamar funções)
// controlRecipes();

// Função controlSearchResults responsável por apresentar os resultados na aba esquerda
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Obtem query de pesquisa
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Carrega os resultados de pesquisa
    await model.loadSearchResults(query);

    // 3) Renderiza os resultados
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Renderiza os botões
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Função controlPagination responsável por controlar a paginação
const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Função controlServings responsável por atualizar as porções da receita
const controlServings = function (newServings) {
  // Update das porções
  model.updateServings(newServings);

  // Update view da receita
  recipeView.render(model.state.recipe);
  // recipeView.update(model.state.recipe);
};

// Função controlAddBookmark responsável por adicionar/remover as receitas dos favoritos
const controlAddBookmark = function () {
  // Adicionar/remover bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // console.log(model.state.recipe);

  // Update view da receita
  recipeView.render(model.state.recipe);

  // Renderizar bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Função controlBookmarks responsável por renderizar a lista de receitas favoritas
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Função controlAddRecipe responsável por lidar com o upoload de uma nova receita
const controlAddRecipe = async function (newRecipe) {
  try {
    // Apresentação do loading spinner
    addRecipeView.renderSpinner();

    // Upload de nova receita
    await model.uploadRecipe(newRecipe);

    // Renderização de nova receita
    recipeView.render(model.state.recipe);

    // Mensagem de sucesso
    addRecipeView.renderMessage();

    // Renderização dos favoritos
    bookmarksView.render(model.state.bookmarks);

    // Alteração ID no URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);


    // Fechar a janela form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// Responsável por chamar todas as funções criadas
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  bookmarksView.addHandlerRender(controlBookmarks);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
