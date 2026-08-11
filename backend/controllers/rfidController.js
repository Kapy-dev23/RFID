const rfidService = require("../services/rfidService");

/**
 * Regista a entrada de um utilizador através da leitura RFID.
 */
const registerAccess = async (req,res) => {
    try{
        const access = await rfidService.registerAccess(req.body);

        res.status(201).json(access);

    } catch (error) {
        res.status(400).json({ message: error.message});
    }
}


module.exports = {
    registerAccess
}