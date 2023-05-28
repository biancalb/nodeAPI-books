const express = require ('express')
const routerAPI = express.Router()
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
}})
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//processa body em formato json
routerAPI.use(express.json())

const checkToken = (req, res, next) => {
    let authInfo = req.get('authorization')

    if(authInfo ){
        const [bearer, token] = authInfo.split(' ')

        if(!/Bearer/.test(bearer)){
            res.status(400).json({message: 'Tipo de token esperado não informado...', error: true })
            return
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(403).json({ message: 'Acesso negado'})
                return
            }
            req.userId = decodeToken.id
            req.roles = decodeToken.roles
            next()
        })
    } else{
        res.status(403).json({ message: 'Acesso negado. Você não possui autorização para efetuar essa operação'})
    }
}

const isAdmin = (req, res, next) => {
    knex.select('*').from('usuarios').where('id', req.userId)
    .then (usuario => {
        let roles = usuario[0].roles.split(';')
        if(roles && roles.find(a => a.toLowerCase() == 'admin')){
            next();
        } 
        else {
            res.status(403).json({ message: 'Acesso negado. Você não possui autorização para efetuar essa operação'})
        }
    })
    .catch (err => res.json ({ message: `Erro ao recuperar usuarios: ${err.message}` }))
}

routerAPI.post ('/livros', checkToken, isAdmin, function (req, res) {
    knex('livros').insert(req.body, ['id'])
    .then (livros => {
      let id = livros[0].id
      res.json({ message: `Livro salvo com sucesso.`, id  })
    })
    .catch (err => {console.log(err.message);res.json ({ message: `Erro ao salvar livro: ${err.message}` })})
})

//GET lista
// routerAPI.get ('/livros', checkToken, isAdmin, function (req, res) {
routerAPI.get ('/livros', checkToken, function (req, res) {
    knex.select('*').from('livros')
    .then (livros => res.json(livros))
    .catch (err => res.json ({ message: `Erro ao recuperar livros: ${err.message}` }))
})

//GET
routerAPI.get('/livros/:id', checkToken, function (req, res) {
    const { id } = req.params;

    knex('livros').where('id', id)
    .then( livro => {
        if(livro.length){
            res.status(200).json(livro)
        } else {
            res.status(404).json({message: 'Livro não encontrado'})
        }} )
    .catch(err => {
        res.status(404).json({message: 'Livro não encontrado' + err.message })
    })
})

routerAPI.put ('/livros/:id', checkToken, isAdmin, function (req, res) {
    const { id } = req.params;
    const livro = req.body;

    knex('livros').where('id', id).update(livro, ['id', 'nome'])
    .then (prod => {
        res.json({ message: `Livro ${prod[0].id} (${prod[0].nome}) alterado com sucesso.` })
      })
    .catch (err => res.json ({ message: `Erro ao alterar livro: ${err.message}` }))
})

routerAPI.delete ('/livros/:id', checkToken, isAdmin, function (req, res) {
    const { id } = req.params;
    knex('livros').where('id', id).del()
    .then (prod => {
        res.json({ message: `livro ${id} excluído com sucesso.` })
      })
      .catch (err => res.json ({ message: `Erro ao excluir livro ${id}: ${err.message}` }))
})

routerAPI.post ('/seguranca/register', checkToken, isAdmin, function (req, res) {
    knex('usuarios').insert({
        nome: req.body.nome,
        login: req.body.login,
        senha: bcrypt.hashSync(req.body.senha, 8),
        email: req.body.email,
        roles: "USER"
    }, ['id'])
    .then ((result) => {
        let usuario = result[0]
        res.status(200).json({
            "message": "Usuário inserido com sucesso",
            "id": usuario.Id
        })
        return
    })
    .catch (err => res.json ({ message: `Erro ao salvar usuário: ${err.message}` }))
})

routerAPI.get ('/seguranca/usuarios', function (req, res) {
    knex.select('*').from('usuarios')
    .then (usuarios => res.json(usuarios))
    .catch (err => res.json ({ message: `Erro ao recuperar usuarios: ${err.message}` }))
})

routerAPI.post('/seguranca/login', function(req, res) {
    knex
    .select('*').from('usuarios').where( { login: req.body.login })
    .then( usuarios => {
        if(usuarios.length){
            let usuario = usuarios[0]
            let checkSenha = bcrypt.compareSync (req.body.senha, usuario.senha)
            if (checkSenha) {
                var tokenJWT = jwt.sign({ id: usuario.id, roles: usuario.roles }, process.env.SECRET_KEY, { expiresIn: 3600 })
        
                res.status(200).json ({
                    id: usuario.id,
                    login: usuario.login,
                    nome: usuario.nome,
                    roles: usuario.roles,
                    token: tokenJWT,
                    message: 'Login realizado com sucesso'
                })
                return
            }
        }
        res.status(401).json({ message: 'Login ou senha incorretos' })
    })
    .catch (err => {
        res.status(500).json({ message: 'Erro ao verificar login - ' + err.message })
    })
})

// routerAPI.put ('/seguranca/register/:id', function (req, res) {
//     const { id } = req.params;
//     const livro = req.body;
//     livro.senha =  bcrypt.hashSync(req.body.senha, 8),

//     knex('usuarios').where('id', id).update(livro, ['id', 'nome'])
//     .then (prod => {
//         res.json({ message: `Livro ${prod[0].id} (${prod[0].nome}) alterado com sucesso.` })
//       })
//     .catch (err => res.json ({ message: `Erro ao alterar livro: ${err.message}` }))
// })


module.exports = routerAPI