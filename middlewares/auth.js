const jwt = require("jsonwebtoken");
const autoConfig = require("../config/auth.json");

module.exports = (req, res, next)=>{

    const autoHeader = req.headers.authorization; //Pegando a 'authorization' lá no Header
    if(!autoHeader){ //Se não existir uma authorization no header..
        return res.status(401).send({error: "No token provided"});//..token não informado
    }

//o TOKEN é formado por duas partes.  1ª- Começa com a palavra 'Bearer' seguida de 'Espaço' e em seguida vem o "Token"
    const parts = autoHeader.split(" "); // Dividindo o 'authorization' pelo espaço(" ")
    if(!parts.length === 2){ //Se parts não tiver 2 valores..
        return res.status(401).send({error: "Token error"});//Dá erro de token
    }

    const [scheme, token] = parts; // Dando 'nomes' as duas partes do 'parts'. A do index[0] com o nome 'scheme'(este tem que ser a palavra 'Bearer'). Index[1] com o nome 'token'(este tem que ser o token)
    if(!/^Bearer$/.test(scheme)){ //Se não for a palavra 'Bearer'(é um regex('/' indica o começo e o final. '^' indica o começo da palavra e o '$' indica o final da palavra))...
        return res.status(401).send({error: "Token malformatted"}); //Dá erro de token malformado
    }

    jwt.verify(token, autoConfig.secret, (err, decoded)=>{ //Verificando se 'token'(2ª parte do authorization) é da aplicação(autoConfig.secret). Em seguida vem o 'callback'..
        if(err){
            return res.status(401).send({error: "Invalid token"}); //Se tiver erro..'Token inválido'
        } else{
            req.userId = decoded.id; //Agora que usou o 'req.userId', o próximo middleware ou próxima função, terá acesso a este 'req.userId'
            //Ter o 'req.userId' é bom para, por ex: que alguma requisição(como troca de senha), além de precisar que o usuário esteja autenticado, preciso verificar que é o real dono daquela senha(Já que não podemos deixar que qualquer usuário altere aquela senha)

            return next(); //..senão..Tudo certo, pode dar continuidade..
        }
    })
}

//Para testar, usar o Insomnia e na parte de "Header", colocar o 'authorization' e testar diferentes maneiras de erros