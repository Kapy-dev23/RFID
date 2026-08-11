//Importa a biblioteca que vai permitir verificar os tokens JWT.
const jwt = require ("jsonwebtoken");

/**
 * Uma função middleware é uma função que é executada antes do controller,
 * se o middleware bloquear, o controller nunca é executado. 
 */
const auth = (req,res, next) => {

    /**
     * Buscar o token ao pedido HTTP do cliente, posteriormente
     * o authService gera um JWT e devolve o token.
    */
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Token não fornecido"});
    }

    //Separar a palavra Bearer do token
    const token = authHeader.split (" ")[1];

    try{
        /**
         * O verify(), verifica se o token foi criado com a mesma chave secreta
         * (JWT_SECRET), verifica se não expirou e por fim verifica se nao foi alterado
         * se tudo estiver correto, devolve o contéudo do token
         * O middleware verifica se o token foi criado com a minha JWT_SECRET se foi entao devolve o resultado.
         */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /**
         * Guardo as informaçoes dentro do pedido (req), para saber quem fez o pedido,
         * ou seja confirma que o pedido é de um utilizador autenticado e identifica quem fez o pedido.
        */
        req.user = decoded;

        //Vai para o controller
        next();
    } catch (error){
        return res.status(401).json({message: "Token inválido"});
    }
}

module.exports = auth;