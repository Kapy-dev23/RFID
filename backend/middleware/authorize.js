/**
 * O middleware authorize serve para saber se o utilizador
 * tem permissão para executar uma devida ação.
 */
const authorize = (...roles) => {

    return (req, res, next) => {


        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Sem permissões."
            });
        }

        next();

    };

};

module.exports = authorize;