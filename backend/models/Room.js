const mongoose = require ("mongoose");

/**
 * Modelo representa uma sala do hospital
 * Define as informações necessárias para identificar e gerir uma sala de hospital
 */
const roomSchema = new mongoose.Schema({
    
    //Nome da sala
    name: {
        type: String,
        required: true
    },

    //Nome do edificio onde a sala se encontra
    building: {
        type: String,
        required: true
    },

    //Capacidade máxima da sala
    capacity: {
        type: Number,
        required: true,
        min: 1
    },

    currentOccupancy: {
        type: Number,
        default: 0
    },

    state: {
        type: String,
        enum: ["active", "inactive", "maintenance"],
        default: "inactive"
    }

    }, {
    // Adiciona createdAt e updatedAt automaticamente
    timestamps: true

})

module.exports = mongoose.model("Room", roomSchema);