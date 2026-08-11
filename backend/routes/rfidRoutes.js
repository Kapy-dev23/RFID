const express = require("express");
const router = express.Router();

const rfidController = require ("../controllers/rfidController");

/**
 * Nesta versão, as rotas /entry e /exit estão protegidas por JWT porque os acessos são simulados. Numa implementação real, 
 * estas rotas seriam chamadas automaticamente pelo leitor RFID, utilizando um mecanismo de autenticação próprio para dispositivos,
 * como uma API Key ou um token específico.
 */

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");


//Registar entrada
router.post("/access", auth, authorize("admin"), rfidController.registerAccess);

module.exports = router;