const express = require("express");
const User = require("../models/users");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const autoConfig = require("../config/auth.json")

function generateId(params = {}){ //IMPORTANTE: Observe que está passando como argumento um OBJETO. Por isso que aqui no 'generateId' está como 'params = {}'
    return jwt.sign(params, autoConfig.secret, {expiresIn: 86400})
}
//OBS:  Pode-se gerar este "MD5 Hash"(autoConfig.secret) na própria internet.

router.post("/register", async (req, res)=>{
    const {email} = req.body; //'{email}' é o obj 'email' e estamos pegando o corpo do email(req.body) que no caso, é o email digitado pelo usuário
    try {
        if(await User.findOne({email})){ //Se o email digitado pelo usuário, for igual a qualquer email no DB, então...
            res.status(400).send("Email already exists"); //Aparecerá esta mensagem
        }
        let user = await User.create(req.body);
        user.password = undefined; //"esconde" o password, não mostrando assim na tela. Protegendo a senha do usuário
        return res.send({user,
                         token: generateId({id: user.id})})//Mostrando os dos do usuário recém criado, + o token. Passando como arg(params) o id do usuário. IMPORTANTE: Observe que está passando como argumento um OBJETO. Por isso que lá no 'generateId' está como 'params = {}'
    } 
    catch (error) {
        return res.status(400).send({error: "Register failed"});
    }
})

router.post("/authenticate", async (req, res)=>{
    const {email, password} = req.body; //pegando o valor do email e do password

    let user = await User.findOne({email}).select("+password"); //o 'user' irá encontrar o documento que terá o '{email}' + o 'password'
    if(!user){ //Se não encontrar..
        return res.status(400).send({error: "User not found"}) // Passará a msg de usuário não encontrado
    }

    if(!await bcrypt.compare(password, user.password)){ //O 'bcrypt.compare' irá comparar o valor 'password' com o password que está vinculado ao usuário('user.password')
        return res.status(400).send({error: "Invalid Password"}) //Se não for compatível, irá aparecer uma mensagem de Senha Inválida
    }

    // const token = await jwt.sign(params, autoConfig.secret, {expiresIn: 86400})
    // Autenticando...ao logar(sign), irá pegar um valor único que cada usuário tem(user.id)..
    // Irá comparar uma chave secreta da própria aplicação(autoConfig.secret)..
    // Definirá um tempo de expiração do login(No caso, 86400 segundos, ou, 1 dia)

    user.password = undefined; //Ocultando o Password
    res.send({user, 
              token: generateId({id: user.id})}); //Mostrando os dados do usuário, + o token. Passando como arg(params) o id do usuário
})

module.exports = app => app.use("/auth", router); 
//Recebendo o parâmetro 'app'. OBS: Como recebe somente um parâmetro, pode então omitir os parenteses. Poderia ficar assim também: (app)
//Retornando com o "app.use" e... 
//Definindo uma rota anterior  ao '/register'("/auth", router), ou seja, sempre que tiver que criar um novo usuário, terá que passar pelo '/auth'