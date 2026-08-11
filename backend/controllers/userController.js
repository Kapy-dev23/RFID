const userService = require("../services/userService");

/**
 * Cria um novo utilizador.
 */
const createUser = async (req,res) => {
    try{
        const user = await userService.createUser(req.body); //Recebe os dados enviados pelo cliente.

        res.status(201).json(user);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

/**
 * Devolve o id do utilizador.
 */
const getUserById = async(req,res) => {
    try{
        const user = await userService.getUserById(req.params.id);

        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/**
 * Devolve o código rfid do utilizador.
 */
const getUserByRfid = async (req,res) => {
    try{
        const user = await userService.getUserByRfid(req.params.rfid);
    

    res.status(200).json(user);

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/**
 * Devolve todos os utilizadores do sistema.
 */
const getAllUsers = async (req,res) => {
    try{
        const user = await userService.getAllUsers();

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * Atualiza os dados pessoais do utilizador.
 */
const updateUser = async (req,res) => {
    try{
        const user = await userService.updateUser(req.params.id, req.body);

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

/**
 * Apaga um utilizador através do seu id.
 */
const deleteUser = async (req,res) => {
    try{
        const user = await userService.deleteUser(req.params.id);

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
} 

module.exports = {
    createUser,
    getUserById,
    getUserByRfid,
    getAllUsers,
    updateUser,
    deleteUser
};