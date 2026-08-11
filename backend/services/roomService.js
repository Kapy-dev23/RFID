const Room = require ("../models/Room");

const Door = require("../models/Door");

/**
 * Cria uma nova sala no sistema.
 * Valida os dados recebidos e regista a sala na base de dados.
 * 
 * @param {Object} roomData - Dados da sala a registar.
 * @returns {Object} Sala criada.
 */
const createRoom = async (roomData) => {

    // Obtem os dados enviados pelo utilizador.
    const {name, building, capacity} = roomData;

    // Verificar se todos os campos obrigatórios foram preenchidos.
    if(!name || !building || !capacity){
        throw new Error("Todos os campos são obrigatórios.");
    }

    // Verificar se o nome da sala já esta registado.
    const roomExists = await Room.findOne({ name });

    if(roomExists){
        throw new Error("Já existe uma sala com esse nome.");
    }

    // Verifica se a capacidade é um numero inteiro e maior que 0.
    if(!Number.isInteger(capacity) || capacity <= 0){
        throw new Error("A capacidade deve ser um número superior a 0.");
    }

    //Criar a sala.
    const room = await Room.create({
        name,
        building,
        capacity,
        state: "inactive"
    });
    
    // Devolver a sala criada.
    return room;

}

/**
 * Obtem uma sala através do seu identificador.
 * 
 * @param {String} id - Identificador único da sala.
 * @returns {Object} Sala encontrada.
 */
const getRoomById = async (id) => {
    
    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id da sala é obrigatório.");
    }

    //Procurar se o id da sala esta na base de dados.
    const room = await Room.findById(id);

    if(!room){
        throw new Error("Sala não encontrada.");
    }

    // Devolver a sala encontrada.
    return room;

}

/**
 * Obtem todas as salas registadas no sistema.
 * 
 * @returns {Object[]} Lista de salas.
 */
const getAllRooms = async () => {

    // Procurar todas as salas registadas no sistema.
    const room = await Room.find();

    // Devolver a lista de salas.
    return room;
}

/**
 * Atualiza as informaçoes de uma sala.
 * Permite alterar o nome, o edificio e a capacidade da sala.
 * 
 * @param {*} id - Identificador da sala.
 * @param {*} roomData - Dados da sala a atualizar.
 * @returns Sala atualizada.
 */
const updateRoom = async (id, roomData) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id da sala é obrigatório.");
    }

    // Verificar se a sala existe
    const room = await Room.findById(id);

    if(!room){
        throw new Error("Sala não encontrada.");
    }

    // Obter um novo nome enviado pelo utilizador.
    const newName = roomData.name;

    // Obter o nome atual guardado na base de dados.
    const currentName = room.name;

    // Verificar se foi enviado um novo nome.
    if(newName){
        
        // Verificar se o nome é diferente do atual.
        if(newName !== currentName){

            // Verificar se o novo nome da sala já existe
            const roomExists = await Room.findOne({name: newName});

            if(roomExists){
                throw new Error("Já existe uma sala com esse nome.");
            }
        }
    }

    // Verifica se a nova capacidade é um numero inteiro e maior que 0.
    if(roomData.capacity){

        if(!Number.isInteger(roomData.capacity) || roomData.capacity <= 0){
            throw new Error("A capacidade deve ser um número inteiro superior a zero.");
        }
    }

    // Atualizar a sala.
    const updatedRoom = await Room.findByIdAndUpdate(id, roomData, {new: true});

    // Devolver a sala atualizada.
    return updatedRoom;

}

/**
 * Remove uma sala do sistema.
 * 
 * @param {*} id - Identificador da sala.
 * @returns Sala removida.
 */
const deleteRoom = async (id) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id da sala é obrigatório.");
    }

    //Verificar se a sala existe.
    const room = await Room.findById(id);

    if(!room){
        throw new Error("Sala não encontrada.");
    }

    // Eliminar sala.
    const deletedRoom = await Room.findByIdAndDelete(id);

    // Devolver a sala eliminada.
    return deletedRoom;
}

/**
 * Descobrir quantas pessoas estao na sala
 */
const getCurrentOccupancy = async (roomId) => {

    const room = await Room.findById(roomId);

    if(!room){
        throw new Error("Sala não encontrada.")
    }

    return room.currentOccupancy;
}

/**
 * Devolve apenas as salas que ainda nao tem uma porta
 */
const getAvailableRooms = async() => {

    //Todas as portas existentes
    const doors = await Door.find().select("room");

    //Ids das salas que ja tem porta
    const occupiedRooms = doors.map(door => door.room);

    //Salas sem porta
    return await Room.find({
        _id: {$nin: occupiedRooms}//Procura todos os registos cujo id não esta dentro do array occupiedRooms
    });
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