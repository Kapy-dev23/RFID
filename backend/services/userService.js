const User = require ("../models/User"); //a variável representa o estrutura do meu model (importa o modelo User)
const bcrypt = require("bcrypt");

/**
 * Cria um novo utilizador no sistema.
 * Valida os dados recebidos e regista o utilizador na base de dados.
 * 
 * @param {Object} userData - Dados do utilizador a registar.
 * @returns {Object} Utilizador criado.
 */
const createUser = async(userData) => {

    // Obtem os dados enviados pelo utilizador
    const {firstName, lastName, email, password, rfid, role} = userData;

    // Verificar se todos os campos obrigatórios foram preenchidos.
    if(!firstName||!lastName||!email||!password||!rfid||!role){
        throw new Error ("Todos os campos são obrigatórios.");
    }

    // Verificar se o email já esta registado
    const emailExists = await User.findOne({ email });

    if(emailExists){
        throw new Error("O email já se encontra registado.")
    }

    // Verificar se o RFID já esta associado a outro utilizador
    const rfidExists = await User.findOne({ rfid });

    if(rfidExists){
        throw new Error("Esta pulseira rfid já esta registada.")
    }

    // Encriptar a palavra-passee
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o utilizador
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        rfid,
        role
    });

    // Devolver o utilizador criado
    return user;

};

/**
 * Obtem um utilizador através do seu identificador.
 * 
 * @param {String} id - Identificador único do utilizador.
 * @returns {Object} Utilizador encontrado.
 */
const getUserById = async(id) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id do utilizador é obrigatório")
    }

    // Procurar se o id do utilizador esta na base de dados
    const user = await User.findById(id);

    if(!user){
        throw new Error("Utilizador não encontrado")
    }

    // Devolver o utilizador encontrado
    return user;
    
}

/**
 * Obtem um utilizador através do código rfid.
 * 
 * @param {String} rfid - Código único da pulseira RFID.
 * @returns {Object} Utilizador encontrado.
 */
const getUserByRfid = async (rfid) => {
    
    // Verificar se foi fornecido um RFID.
    if(!rfid){
        throw new Error("O código RFID é obrigatório")
    }

    // Procurar o utilizador na base de dados.
    const user = await User.findOne({ rfid });

    // Verificar o utilizador na base de dados.
    if(!user){
        throw new Error("Utilizador não encontrado")
    }

    // Devolver o utilizador encontrado.
    return user;
}

/**
 * Obtem todos os utilizadores registados no sistema.
 * 
 * @returns {Object[]} Lista de utilizadores.
 */
const getAllUsers = async () => {

    // Procura todos os utilizadores registados no sistema.
    const users = await User.find();

    // Devolver a lista de utilizadores.
    return users;
}
/**
 * Atualiza um utilizador existente.
 * Valida os dados recebidos e altera apenas os campos enviados.
 * 
 * @param {*} id - Identificador do utilizador.
 * @param {*} userData - Dados do utilizador a atualizar.
 * @returns Utilizador atualizado.
 */
const updateUser = async (id, userData) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id do utilizador é obrigatório")
    }

    // Encontrar o utilizador atraves do ID.
    const user = await User.findById(id);

    // Verificar se o utilizador existe.
    if(!user){
        throw new Error("Utilizador não encontrado")
    }

    // Obter o novo email enviado pelo utilizador.
    const newEmail = userData.email;

    // Obter o email atual guardado na base de dados.
    const currentEmail = user.email;

    //Verificar se foi enviado um novo email
    if(newEmail){

        // Verifica se o novo email é diferente do atual
        if(newEmail !== currentEmail){

            // Verificar se esse novo email já pertence a outro utilizador.
            const emailExists = await User.findOne({ email: newEmail });

            if(emailExists){
                throw new Error("O email já se encontra registado");
            }
        }   
    }

    // Obter o novo código enviado pelo utilizador.
    const newRfid = userData.rfid;
    
    // Obter o codigo rfid atual guardado na base de dados.
    const currentRfid = user.rfid;

    //Verificar se foi enviado um novo código rfid.
    if(newRfid){

        // O utilizador alterou o código rfid?
        if (newRfid !== currentRfid) {

            // Verificar se esse novo código rfid já pertence a outro utilizador.
            const rfidExists = await User.findOne({ rfid: newRfid });

            if (rfidExists) {
                throw new Error("Esta pulseira RFID já está registada.");
            }

        }
    }
    
    // Verificar se foi enviada uma nova palavra-passe
    if(userData.password){
        // Encriptar a nova palavra-passe
        userData.password = await bcrypt.hash(userData.password,10);
    }

    // Atualizar o utilizador
    const updatedUser = await User.findByIdAndUpdate(id,userData,{ new: true });

    // Devolver o utilizador atualizado
    return updatedUser;
    
}

/**
 * Remove um utilizador do sistema.
 * 
 * @param {String} id - Identificador do utilizador.
 * @returns {Object} Utilizador removido.
 */
const deleteUser = async (id) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id do utilizador é obrigatório.")
    }

    // Procurar utilizador.
    const user = await User.findById(id);

    // Verificar se o utilizador existe.
    if(!user){
        throw new Error("O utilizador não encontrado.")
    }

    // Eliminar utilizador.
    const deletedUser = await User.findByIdAndDelete(id);

    //Devolver o utilizador eliminado.
    return deletedUser;

}

module.exports = {
    createUser,
    getUserById,
    getUserByRfid,
    getAllUsers,
    updateUser,
    deleteUser
}