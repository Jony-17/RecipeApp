// Model (lógica do negócio, estado, http library)

import { API_URL, RES_PER_PAGE, KEY } from "./config"; // Import do URL da API
import { AJAX } from "./helpers.js"; // Import do fetch da API
// import { getJson, sendJson } from "./helpers"; // Anterior import do fetch da API

// Exporta um objeto state com o intuito de armazenar os dados depois de carregados, assim como os resultados por página (export para outras partes do código poderem utilizar)
export const state = {
  // Armazena a receita atual
  recipe: {},
  // Contém informações sobre a pesquisa
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  // Lista de receitas favoritas
  bookmarks: [],
};

// Função createRecipeObject para transformar os dados recebidos da API num formato reutilizável
const createRecipeObject = function (data) {
  console.log(data);
  const { recipe } = data.data; // Extrai a receita dos dados recebidos (o mesmo que recipe = data.data.recipe)
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Adicionar a propriedade key ao objeto, se recipe.key existir
  };
};

// Função loadRecipe responsável por obter e carregar as receitas consoante o id passado
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // console.log(res);
    // console.log(data);

    /*
    // Um dos atributos seria data que por sua vez, dentro desse atributo, possuia outro atributo também chamado data
    const { recipe } = data.data; // Destruturação -> o mesmo que fazer: let recipe = data.data.recipe;

    // state.recipe para armazenar os dados no objeto que foi criado
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      key: recipe.key,
    };
    */

    state.recipe = createRecipeObject(data);

    // Verifica se a receita está marcada como favorita
    if (
      state.bookmarks.some(function (bookmark) {
        return bookmark.id === id;
      })
    ) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    // console.log(`State recipe: ${state.recipe}`);
  } catch (err) {
    // Tratamento do erro (try...catch)
    console.log(err);
    throw err;
  }
};

// Função loadSearchResults responsável por apresentar as receitas na aba da esquerda consoante cada query
export const loadSearchResults = async function (query) {
  try {
    // Armazena a query no estado
    state.search.query = query;
    // Chama a API consoante a query
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    // Mapeia os resultados
    state.search.results = data.data.recipes.map(function (rec) {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Reinicia a página sempre que existe uma pesquisa
    state.search.page = 1;
    console.log(state.search.results);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Função getSearchResultsPage responsável por criar a paginação
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

// Função updateServings atualiza as quantidades dos ingredientes com base no nº de porções
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(function (ing) {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

// Função persistBookmarks para guardar os favoritos no localStorage
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

// Função addBookmark para adicionar uma receita aos favoritos
export const addBookmark = function (recipe) {
  // Adicionar favorito
  state.bookmarks.push(recipe);

  // Marcar receita atual como favorita
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

// Função deleteBookmark para eliminar uma receita dos favoritos (quando se adiciona algo passa-se os dados, enquanto que para eliminar basta o ID)
export const deleteBookmark = function (id) {
  // Remover favorito
  const index = state.bookmarks.findIndex(function (el) {
    return el.id === id;
  });

  state.bookmarks.splice(index, 1);

  // Marcar receita atual como não favorita
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

// Inicializa o estado dos favoritos quando a aplicação é carregada
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// Função uploadRecipe responsável por fazer upload de uma nova receita para a API
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe) // Converte o objeto newRecipe num array de pares
      .filter(function (entry) {
        return entry[0].startsWith("ingredient") && entry[1] !== "";
      })
      .map(function (ing) {
        const ingArr = ing[1].split(",").map(function (el) {
          return el.trim();
        });
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3)
          throw new Error("Wrong ingredient. Please use the correct format!");

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime, // Uso do + para garantir que são nºs
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
