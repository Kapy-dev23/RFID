const roomService = require("../services/roomService");

/**
 * Cria uma nova sala.
*/
const createRoom = async (req,res) => {
    try{
        const room = await roomService.createRoom(req.body);

        res.status(201).json(room);

    } catch (error){
        res.status(400).json({message:error.message});
    }
}

/**
 * Devolve o id de uma sala.
 */
const getRoomById = async (req,res) => {
    try{
        const room = await roomService.getRoomById(req.params.id);

        res.status(200).json(room);

    } catch (error){
        res.status(404).json({message: error.message});
    }
}

/**
 * Devolve todas as salas do sistema.
 */
const getAllRooms = async (req,res) => {
    try{
        const room = await roomService.getAllRooms();
        
        res.status(200).json(room);

    } catch (error){
        res.status(500).json({message: error.message});
    }
}

/**
 * Atualiza as informaçoes sobre a sala.
 */
const updateRoom = async (req,res) => {
    try{
        const room = await roomService.updateRoom(req.params.id, req.body);

        res.status(200).json(room);

    } catch (error){
        res.status(400).json({message: error.message});
    }

}

/**
 * Elimina uma sala.
 */
const deleteRoom = async (req,res) => {
    try{
        const room = await roomService.deleteRoom(req.params.id);

        res.status(200).json(room);

    } catch (error){
         res.status(400).json({message:error.message}); 
    }

}


/**
 * Descobrir quantas pessoas estao na sala
 */
const getCurrentOccupancy = async (req,res) => {
    try{
    const occupancy = await roomService.getCurrentOccupancy(req.params.id);

    res.status(200).json({currentOccupancy: occupancy});
    
    } catch (error){
        res.status(404).json({ message: error.message });
    }
    
}

/**
 * Devolver o numero de salas sem porta.
 */
const getAvailableRooms = async (req,res) => {
    try{

        const rooms = await roomService.getAvailableRooms();

        res.status(200).json(rooms);
        
    } catch (error) {

        res.status(500).json({message: error.message});

    }
}


module.exports = {
    createRoom,
    getRoomById,
    getAllRooms,
    updateRoom,
    deleteRoom,
    getCurrentOccupancy,
    getAvailableRooms
}