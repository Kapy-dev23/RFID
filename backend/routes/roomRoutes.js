const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

//Criar uma nova sala.
router.post("/", auth, authorize("admin"), roomController.createRoom);

//Devolver todas as salas.
router.get("/", auth, authorize("admin", "staff"), roomController.getAllRooms);

//Devolve todas as salas sem porta
router.get("/available", auth, authorize("admin"), roomController.getAvailableRooms);

//Obter uma sala pelo id.
router.get("/:id", auth, authorize("admin", "staff"), roomController.getRoomById);

//Descobrir quantas pessoas estam numa sala
router.get("/:id/occupancy", auth, authorize("admin", "staff"), roomController.getCurrentOccupancy);

//Atualizar uma sala.
router.put("/:id", auth, authorize("admin"), roomController.updateRoom);

//Eliminar uma sala.
router.delete("/:id", auth, authorize("admin"), roomController.deleteRoom);


module.exports = router;