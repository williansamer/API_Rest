const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

require("./controllers/authController")(app);
//Requisitando o "./controllers/authController"
//Repassando para o 'authController' o 'app'. Para poder usar este obj nos outros arquivos
require("./controllers/projectController")(app);

app.listen(3000, ()=>{
    console.log("Server running..")
})