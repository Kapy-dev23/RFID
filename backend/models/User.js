const mongoose = require ("mongoose");

/**
 * Modelo que representa um utilizador.
 * Cada utilizador possui uma pulseira RFID única para controlo de acessos.
 * Define os campos obrigatórios de cada utilizador registado.
 */
const userSchema = new mongoose.Schema({

    //Primeiro nome do utilizador
    firstName: {
        type: String,
        required: true
    },

    //Último nome do utilizador
    lastName: {
        type: String,
        required: true
    },

    //Email único do utilizador
    email: {
        type: String,
        unique: true,
        sparse: true
    },

    //Palavra-passe (será encriptado com bycrpt)
    password: {
        type: String,
    },

    //Código único da pulseira RFID
    rfid: {
        type: String,
        required: true,
        unique: true,
    },

    //Função do utilizador (Tipo de utilizador)
    role: {
        type: String,
        enum: [
            "admin",
            "receptionist",
            "doctor",
            "nurse",
            "patient",
            "visitor",
        ],
        required: true
    },

    //Estado da Conta
    active: {
        type: Boolean,
        default: true
    }

    }, {
    // Adiciona createdAt e updatedAt automaticamente
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);