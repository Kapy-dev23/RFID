const User = require ("../models/User");
const Door = require ("../models/Door");
const AccessLog = require("../models/accessLog");
const accessLogService = require("./accessLogService");

/**
 * RfidService - É o serviço de validação de acesso, a função
 * dele é verificar se estão reunidas todas as condiçoes para permitir a entrada ou saida.
 * Por exemplo verifica se o leitor conseguue saber o codigo que acabou de ler e o seu próprio identificador
 * Verifica se existe utilizador, existe porta, o utilizador esta ativo e se a porta esta ativa.
*/


/**
 * Regista um acesso através da leitura da pulseira RFID.
 */
const registerAccess = async (accessData) => {

    const {rfid, readerId} = accessData;

    //Verificar se todos os campos foram enviados
    if(!rfid || !readerId) {
        throw new Error("Todos os campos são obrigatórios.");
    }

    // Procurar o utilizador pelo RFID.
    const user = await User.findOne({ rfid });

    if(!user){
        throw new Error("Utilizador não encontrado.");
    }

    // Verificar se o utilizador está ativo.
    if(!user.active){
        throw new Error("O utilizador encontra-se inativo.")
    }

    // Procurar a porta pelo readerID.
    const door = await Door.findOne({readerId});

    if(!door){
        throw new Error("Porta não encontrada.")
    } 

    // Verificar se a porta está ativa.
    if(door.state !== "active"){
        throw new Error("A porta encontra-se inativa.")
    }

    //Procurar o ultimo acesso do utilizador
    const lastAccess = await AccessLog.findOne({
        user: user._id
    }).sort({date: -1});

    let type;

    /**
     * Entrada do hospital
     */
    if(door.doorType === "hospitalEntry"){

        //Se o utilizador já passou pela entrada principal sendo o ultimo log e o ultimo acesso tendo tambem como tipo enter, entao da erro
        if(lastAccess && lastAccess.type === "enter"){
            throw new Error ("O utilizador já se encontra dentro do hospital.");
        }

        type = "enter";
    }

    /**
     * Saída do hospital
    */
    else if(door.doorType === "hospitalExit"){
        if(!lastAccess || lastAccess.type === "exit"){
            throw new Error("O utilizador já se encontra fora do hospital.")
        }

        type = "exit";
    }

    /**
     * Mudança de salas
    */
    else if(door.doorType === "internal"){

        type = "move";
    }

    else{
        throw new Error("Tipo de porta inválido.");
    }

    //Criar registo de acesso
    const accessLog = await accessLogService.createAccessLog({
        userId: user._id,
        doorId: door._id,
        type,
        authorised: true
    });

    /**
     * Devolve os ids validados.
     */
    return accessLog;
}

module.exports = {
    registerAccess
}