const Door = require("../models/Door");
const Room = require ("../models/Room");


/**
 * Cria uma nova porta no sistema.
 * Valida os dados recebidos e regista a porta na base de dados.
 * 
 * @param {Object} doorData - Dados da porta a registar.
 * @returns {Object} Porta criada.
 */
const createDoor = async (doorData) => {

    // Obtem os dados enviados pelo cliente
    const {name, location, state, room, readerId, doorType} = doorData;

    // Verificar se todos os campos obrigatórios foram preenchidos.
    if(!name || !location || !state || !room || !readerId || !doorType){
        throw new Error("Todos os campos são obrigatórios.")
    }

    // Verificar se já existe uma porta com o mesmo nome.
    const doorExists = await Door.findOne({ name });

    if(doorExists){
        throw new Error("Já existe uma porta com esse nome.")
    }

    //Verificar se a sala já tem uma porta associada.
    const roomAlreadyHasDoor = await Door.findOne({room});

    if(roomAlreadyHasDoor){
        throw new Error("Esta sala já possui uma porta.")
    }

    // Verificar se o readerId já esta associado a outra porta.
    const readerExists = await Door.findOne({ readerId });

    if(readerExists){
        throw new Error("Este leitor RFID já esta associado a outra porta.");
    }

    //Verificar se a sala existe.
    const roomExists = await Room.findById(room);

    if(!roomExists){
        throw new Error("Sala não encontrada");
    }

    // Cria porta.
    const door = await Door.create({
        name,
        location,
        state,
        room,
        readerId,
        doorType
    });

    //Quando associado muda o estado da sala para ativo
    await Room.findByIdAndUpdate(room, {state: "active"}); 

    // Devolve a porta criada.
    return door;

}

/**
 * Obtem uma porta através do seu identificador.
 * 
 * @param {String} id - Identificador único da porta.
 * @returns {Object} Porta encontrada.
 */
const getDoorById = async (id) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id da porta é obrigatório.")
    }

    // Procurar se o id da porta esta na base de dados.
    const door = await Door.findById(id).populate("room");

    if(!door){  
        throw new Error("Porta não encontrada.")
    }   

    // Devolver a porta encontrada.
    return door;

}

/**
 * Obtem todas as portas registadas no sistema.
 * 
 * @returns {Object[]} Lista de portas.
 */
const getAllDoors = async () => {

    // Procura todas as portas registadas no sistema.
    const doors = await Door.find().populate("room");

    //Devolve a lista de portas.
    return doors;

}

/**
 * Atualiza uma porta existente.
 * Valida os dados recebidos e altera apenas os campos enviados.
 * 
 * @param {*} id - Identificador da porta.
 * @param {*} userData - Dados da porta a atualizar.
 * @returns Porta atualizada.
 */
const updateDoor = async (id, doorData) => {

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error ("O id da porta é obrigatório.")
    }

    // Encontrar a porta atraves do ID.
    const door = await Door.findById(id);

    //Verificar se a porta existe
    if (!door){
        throw new Error("Porta não encontrada.")
    }

    //Obter um novo nome enviado pelo utilizador.
    const newName = doorData.name;

    //Obter o nome atual guardado na base de dados.
    const currentName = door.name;

    //Verificar se foi enviado um novo nome.
    if(newName){

        //O utilizador alterou o nome?
        if(newName !== currentName){

            //Verificar  se o novo nome já pertence a outra porta.
            const nameExists = await Door.findOne({ name: newName });

            if(nameExists){
                throw new Error("O nome da porta já se encontra registado.")
            }   
        }
    }

    // Obter o novo código enviado pelo utilizador.
    const newReaderId = doorData.readerId;

    // Obter o codigo rfid atual guardado na base de dados.
    const currentReaderId = door.readerId;

    // Verificar se foi enviado um novo código.
    if(newReaderId){

        // O utilizador alterou o codigo do reader?
        if(newReaderId !== currentReaderId){
            
            //Verificar se esse novo código reader já pertence a outro reader.
            const readerExists = await Door.findOne({readerId: newReaderId})

            if(readerExists){
                throw new Error("Este leitor RFID já está associado a outra porta.")
            }
        }
    }

    // Atualizar a porta.
    const updatedDoor = await Door.findByIdAndUpdate(id, doorData, {new: true});

    //Quando a porta passa para maintenance, a sala também passa.
    await Room.findByIdAndUpdate(updatedDoor.room, {state: updatedDoor.state === "active" ? "active" : "maintenance"})

    // Devolver a porta atualizada.
    return updatedDoor;

}

/**
 * Remove uma porta do sistema.
 * 
 * @param {String} id - Identificador da porta.
 * @returns {Object} Porta removida.
 */
const deleteDoor = async (id) => {  

    // Verificar se foi fornecido um ID.
    if(!id){
        throw new Error("O id da porta é obrigatório")
    }

    // Procurar porta.
    const door = await Door.findById(id);

    // Verificar se a porta existe.
    if(!door){
        throw new Error("Porta não encontrada.")
    }

    // Eliminar porta.
    const deletedDoor = await Door.findByIdAndDelete(id);

    await Room.findByIdAndUpdate(door.room, {state: "inactive"});

    // Devolver a porta eliminada.
    return deletedDoor;
}

module.exports = {
    createDoor,
    getDoorById,
    getAllDoors,
    updateDoor,
    deleteDoor
}