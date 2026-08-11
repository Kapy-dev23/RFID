const mongoose = require ("mongoose");

/**
 * Modelo que representa uma porta do hospital.
 * Define as informações necessárias para identificar e gerir uma porta.
 */
const doorSchema = new mongoose.Schema({
    
    // Nome da porta
    name: {
        type: String,
        required: true
    },

    // Localização da porta
    location: {
        type: String,
        required: true
    },

    // Estado da porta (activa ou inativa)
    state: {
        type: String,
        enum: [
            "active",
            "inactive",
        ],
        required: true
    },

    //Tipo de movimento
    doorType: {
        type: String,
        enum: ["hospitalEntry", "hospitalExit", "internal"],
        required: true
    },

    // Sala da porta
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true 
    },

    // Identificador do leitor RFID (identifica qual foi o leitor que fez a leitura da pulseira)
    readerId: {
        type: String,
        required: true,
        unique: true
    }

     }, {
    // Adiciona createdAt e updatedAt automaticamente
    timestamps: true
});


module.exports = mongoose.model("Door", doorSchema);