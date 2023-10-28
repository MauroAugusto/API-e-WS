const express = require('express');
const app = express();
const port = 3000; // Porta do servidor

let resultados = {
  pessoas: [{ id: 1, nome: "Marcelo" }, { id: 2, nome: "João" }, { id: 3, nome: "Maria" }],
  carros: [{ id: 1, modelo: "Fusca" }, { id: 2, modelo: "Gol" }, { id: 3, modelo: "Palio" }],
  animais: [{ id: 1, nome: "Cachorro" }, { id: 2, nome: "Gato" }, { id: 3, nome: "Papagaio" }]
};

app.get('/', (req, res) => {
  res.status(200).send('Olá, seja bem vindo ao servidor de Mauro Augusto')
  
});

const cache = {}; // Objeto para armazenar as versões em cache dos resultados

// Middleware para verificar o cache
function checkCache(req, res, next) {
  const { path } = req;
  if (cache[path]) {
    const previousData = JSON.stringify(cache[path]);
    const currentData = JSON.stringify(resultados[path.substring(1)]); // Remove a barra inicial da URL
    if (previousData === currentData) {
      res.status(304).send(); // Dados inalterados, retorne 304 (Not Modified)
    } else {
      res.status(200).json(resultados[path.substring(1)]);
    }
  } else {
    next();
  }
}

// Rotas para as URLs especificadas
app.get('/pessoas', checkCache, (req, res) => {
  res.status(200).json(resultados.pessoas);
  cache['/pessoas'] = resultados.pessoas;
});

app.get('/carros', checkCache, (req, res) => {
  res.status(200).json(resultados.carros);
  cache['/carros'] = resultados.carros;
});

app.get('/animais', checkCache, (req, res) => {
  res.status(200).json(resultados.animais);
  cache['/animais'] = resultados.animais;
});


// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
