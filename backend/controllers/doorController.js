const doorService = require ("../services/doorService");

/**
 * Cria uma nova porta.
 */
const createDoor = async (req,res) => {
    try{
        const door = await doorService.createDoor(req.body);

        res.status(201).json(door);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

/**
 * Devolve o id de uma porta.
 */
const getDoorById = async (req,res) => {
    try{
        const door = await doorService.getDoorById(req.params.id);

        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/**
 * Devolve todas as portas do sistema.
 */
const getAllDoors = async (req,res) => {
    try{
        const door = await doorService.getAllDoors();
        
        res.status(200).json(door);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * Atualiza as informaçoes sobre a porta.
 */
const updateDoor = async (req,res) => {
    try{
        const door = await doorService.updateDoor(req.params.id, req.body);

        res.status(200).json(door);

    } catch (error) {
        res.status(400).json({message: error.message});
    }

}

/**
 * Elimina uma porta.
 */
const deleteDoor = async (req,res) => {
    try{
        const door = await doorService.deleteDoor(req.params.id);

        res.status(200).json(door);

    } catch (error) {
        res.status(400).json({message:error.message}); 
    }
}

module.exports = {
    createDoor,
    getDoorById,
    getAllDoors,
    updateDoor,
    deleteDoor
}