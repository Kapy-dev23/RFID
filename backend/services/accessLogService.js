const AccessLog = require("../models/accessLog");
const Door = require("../models/Door");
const Room = require("../models/Room");

/**
 * Cria o registo de acesso.
 * Devolve o histórico de acessos.
 * Pode devolver os registos completos usando populate()
 * (Método Interno)
 */
const createAccessLog = async (accessData) => {
    
    // Obter os dados enviados pelo rfidService.
    const {userId, doorId, type, authorised} = accessData;

    //Procurar porta
    const door = await Door.findById(doorId).populate("room");
    
    //Verificar se a porta tem uma sala associada
    if (!door || !door.room) {
        throw new Error("A porta não está associada a nenhuma sala.");
    }
    
    // Criar o registo de acesso.
    const accessLog = await AccessLog.create({
        user: userId,
        door: doorId,
        type,
        authorised
    });


    //Procurar o último acesso do utilizadores (antes deste)
    const lastAccess = await AccessLog.findOne({
        user: userId,
        _id: {$ne: accessLog._id} //Procura o último acesso, mas ignora o registo que acabei de criar
    })
    .sort({date: -1})
    
    //Popula a sala anterior
    .populate({
        path: "door",
        populate:{
            path: "room"
        }
    });

    //Se for o primeiro acesso ou mudou de sala
    if(!lastAccess|| 
       !lastAccess.door ||
       !lastAccess.door.room ||
        lastAccess.door.room._id.toString() !== door.room._id.toString()){

        //Se estava noutra sala, diminui a ocupação dessa sala.
        if(
            lastAccess &&
            lastAccess.door &&
            lastAccess.door.room &&
            lastAccess.door.room.currentOccupancy > 0
        ) {
            
            lastAccess.door.room.currentOccupancy--;
            await lastAccess.door.room.save();
        
        }
 
        //Adiciona uma nova pessoa á sala
        door.room.currentOccupancy++;
        await door.room.save();
    }

    // Devolver o registo criado.
    return accessLog;

}

const getAccessHistory = async () => {

    /**
     * Procurar todos os registos de acesso.
     * Utilizaçao de path é devido a door estar associado com room.
    */
    const accessLogs = await AccessLog.find()
        .sort({ date: 1 })
        .populate("user")
        .populate({
            path: "door",
            populate: {
                path: "room"
            }
        });

    //Devolver o histórico de acessos.
    return accessLogs;
}

/**
 * Calcula o tempo médio de permanencia em todas as salas
 */
const getAverageWaitingTime = async () =>{

    //Reutilizar o método que já obtem os acessLogs.
    const accessLogs = await getAccessHistory();

    //Agrupar por utilizador
    let totalMinutes = 0;
    let totalVisits = 0;

    //Guarda a hora de entrada de cada utilizador
    const entries = {};
    
    //Percorrer todos os registos 
    for(const log of accessLogs){
        
        //Senão existir na base de dados então passa a frete
        if (!log.user) {
            console.log("AccessLog sem utilizador:", log._id);
            continue;
        }

        //Saber quem é aquele registo
        const userId = log.user._id.toString();


        if(log.type === "enter"){
            entries[userId] = log.date; // exemplo : "U1" : "09:00"; Dentro de cada ID vou ter a respetiva hora de entrada

        } else if (log.type === "exit"){
            
            //Verificar se existe uma entrada guardada para este utilizador
            if(entries [userId]){
                
                //Calcular o tempo de permanencia  
                //O log.date atualiza porque chega outro registo de saida, portanto log.date = 9:20 por exemplo;
                const waitingTime = (log.date - entries[userId]) / 1000 / 60;

                //Somar o tempo total.
                totalMinutes += waitingTime;

                //Contar mais uma visita(permanencias completas).
                totalVisits++;

                //Remover a entrada, porque o utilizador já saiu
                delete entries[userId];
                
            }

        }
    }

    if (totalVisits === 0){
        return 0;
    }

    return totalMinutes/totalVisits


}

module.exports = {
    createAccessLog,
    getAccessHistory,
    getAverageWaitingTime
}
