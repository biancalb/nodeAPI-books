require('dotenv').config()

// Importa o módulo do Express Framework
const express = require ('express')

const routerAPI = require('./routes/routerAPI')
const cors = require('cors');

// Inicializa um objeto de aplicação Express
const app = express ()

app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    app.use(cors({origin:true,credentials: true}));

    next();
});
app.use('/api/v1', routerAPI)

app.use(function(req, res, next){
    res.status(404).send('Recurso não encontrado')
})

app.use(function(req, res, next){
    if (req.method === 'OPTIONS') {
        res.status(200);
    } 
})

// Inicializa o servidor HTTP na porta 3000
app.listen (3000, function () {
    console.log ('Servidor rodando na porta 3000')
})