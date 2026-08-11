const accessLogService = require ("../services/accessLogService");
const { getAllDoors } = require("./doorController");

/**
 * Cria um novo registo de acesso.
 */
const createAccessLog = async (req,res) => {
    try{
        const accessLog = await accessLogService.createAccessLog(req.body);

        res.status(201).json(accessLog);
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

/**
 * Devolve o histórico de acessos.
 */
const getAccessHistory = async (req,res) => {
    try{
        const accessHistory = await accessLogService.getAccessHistory();

        res.status(200).json(accessHistory);

    } catch (error){
        res.status(500).json({message: error.message});
    }
}

/**
 * Calcula o tempo médio de espera
 */
const getAverageWaitingTime = async (req,res) => {
    
    try{
        const average = await accessLogService.getAverageWaitingTime();

        res.status(200).json({averageWaitingTime: average});

    } catch (error){
        console.error(error.stack);  
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createAccessLog,
    getAccessHistory,
    getAverageWaitingTime
}