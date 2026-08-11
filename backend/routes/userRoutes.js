const express = require("express");
const router = express.Router();

const userController = require ("../controllers/userController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

//Criar um novo utilizador
router.post("/", userController.createUser);

//Devolver todos os utilizadores
router.get("/", auth, authorize("admin", "staff"), userController.getAllUsers);

//Obter um utilizador pelo RFID
router.get("/rfid/:rfid", auth, authorize("admin", "staff"), userController.getUserByRfid);

//Obter um utilizador pelo id
router.get("/:id", auth, authorize("admin", "staff"), userController.getUserById);

//Atualizar um utilizador
router.put("/:id", auth, authorize("admin"), userController.updateUser);

//Eliminar um utilizador
router.delete("/:id", auth, authorize("admin"), userController.deleteUser);

module.exports = router;