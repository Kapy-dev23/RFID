const mongoose = require ("mongoose");

/**
 * Modelo que representa e regista todas as entradas e saidas efetuadas através do sistema RFID.
 * Define as informações necessárias para gerir o histórico de acessos
 * dos utilizadores ás diferentes portas do hospital.
 */
const accessLogSchema = new mongoose.Schema({
    
    //Utilizador que efetuou o acesso
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    //Porta utilizada no acesso
    door: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Door",
        required: true
    },

    //Data e hora do acesso
    date: {
        type: Date,
        default: Date.now
    },

    //Tipo de acesso
    type: {
        type:String,
        enum: [
            "enter",
            "exit",
            "move"
        ],
        required:true
    },

    //Indica se o acesso foi autorizado
    authorised: {
        type: Boolean,
        required: true
    }

    }, {
    // Adiciona createdAt e updatedAt automaticamente
    timestamps: true
    });

    module.exports = mongoose.model("AccessLog", accessLogSchema);