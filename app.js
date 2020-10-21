// masz napisaną instancję do zasobu restowego w axiosie
// korzystając z biblioteki axios i jej typów przetestuj tą instancję, mockując odpowiednie klasy

// upewniając się, że:
// - możesz wysłać zapytanie na adres GET /next?q=error
// - możesz obsłużyć błąd typu 500 oraz 404
// - możesz wysłać plik na POST /file
// - jeśli w config.query wejdzie {"key":"value"} to dawać url z końcówką ?key=value
// - możesz obsłużyć błąd spowodowany timeoutem

import axios from 'axios';
import querystring from 'query-string';

// możesz modyfikować i ulepszać instancję axiosa, aby wykonać to zadanie
export const instance = axios.create({
  baseURL: 'https://base-url.com/api/',
  timeout: 1000 * 60,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// staraj się nie modifykować abstrakcji request
export const request = (_url, _config = {}) => {
  let req = {
    url: _url,
    ..._config,
  };
  if (!req.headers) {
    req.headers = {};
  }
  if (_config.multipart) {
    req.headers['content-type'] = 'multipart/form-data';
  }

  if (_config.query && Object.keys(_config.query).length !== 0) {
    req.url +=
      '?' + querystring.stringify(_config.query, { arrayFormat: 'bracket' });
  }

  return instance
    .request(req)
    .then(data => {
      // to trzeba bylo zmienic
      return data;
    })
    .catch(err => {
      // to trzeba bylo zmienic
      return Promise.reject(err);
    });
};
