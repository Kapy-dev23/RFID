const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (email, password) => {

    //Verificar se o email do utilizador existe
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Email ou password inválidos")
    }

    if (!user.active) {
        throw new Error("Utilizador inativo.");
    }

    //Verficar palavra password comparando-a com a encriptada
    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        throw new Error("Email ou password inválidos")
    }

    //Gerar o JWT
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );

    return{

        token,

        user: {
              id: user._id,
              role: user.role
        }
    };
}

module.exports = {
    login
}