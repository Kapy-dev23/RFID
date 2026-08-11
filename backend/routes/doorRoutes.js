const express = require("express");
const router = express.Router();

const doorController = require("../controllers/doorController");


const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

//Criar um novo utilizador.
router.post("/", auth, authorize("admin"), doorController.createDoor);

//Devolver todas as portas. 
router.get("/", auth, authorize("admin", "staff"), doorController.getAllDoors);

//Obter uma porta pelo id.
router.get("/:id", auth, authorize("admin", "staff"), doorController.getDoorById);

//Atualizar uma porta.
router.put("/:id", auth, authorize("admin"), doorController.updateDoor);

//Eliminar um utilizador
router.delete("/:id", auth, authorize("admin"), doorController.deleteDoor);

module.exports = router;