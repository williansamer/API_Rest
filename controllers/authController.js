const express = require("express");
const User = require("../models/users");
const router = express.Router();

router.use("/register", async (req, res)=>{
    const {email} = req.body; //'{email}' é o obj 'email' e estamos pegando o corpo do email(req.body) que no caso, é o email digitado pelo usuário
    try {
        if(await User.findOne({email})){ //Se o email digitado pelo usuário, for igual a qualquer email no DB, então...
            res.status(400).send("Email already exists"); //Aparecerá esta mensagem
        }

        let user = await User.create(req.body);
        user.password = undefined; //"esconde" o password, não mostrando assim na tela. Protegendo a senha do usuário
        return res.send({user})
    } 
    catch (error) {
        return res.status(400).send({error: "Register failed"});
    }

})

module.exports = app => app.use("/auth", router); 
//Recebendo o parâmetro 'app'. OBS: Como recebe somente um parâmetro, pode então omitir os parenteses. Poderia ficar assim também: (app)
//Retornando com o "app.use" e... 
//Definindo uma rota anterior  ao '/register'("/auth", router), ou seja, sempre que tiver que criar um novo usuário, terá que passar pelo '/auth'