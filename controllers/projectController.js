const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth")

router.use(authMiddleware);  //Ao invés desta linha, pode colocar como middleware na linha 'router.get' antes do callback

router.get("/", (req, res)=>{
    res.send({ok: true, user: req.userId}) //Linkando o 'req.userId'(id próprio(único) do usuário) com o token
})

module.exports = app => app.use("/project", router);