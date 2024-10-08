import { TIMEOUT_SEC } from "./config.js";

// Função timeout que retorna uma Promise para prevenir que uma requisição fique pendente indefinidamente
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Função assíncrona que realiza uma requisição HTTP (será POST uma vez que serão enviados dados e não obtidos apenas)
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          // Envia dados para o servidor
          method: "POST",
          // Informa o servidor que os dados estão a ser enviados no formato JSON
          headers: {
            "Content-Type": "application/json",
          },
          // Converte o objeto uploadData numa string JSON
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Inicia a requisição e o timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Converte em JSON
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
// Função getJson responsável por fazer a requisição e conversão do url da API
export const getJson = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Converte a resposta em json
    const data = await res.json();

    // Caso a resposta não seja ok (ou seja, caso o id esteja errado p.e.) apresenta um alerta com o tipo de erro
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};


export const sendJson = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
