

# Services

Os **Services** contêm toda a lógica de negócio da aplicação. São responsáveis por comunicar com os Models e executar as operações necessárias antes de devolver os resultados aos Controllers.

---

# UserService

Responsável pela gestão dos utilizadores.

## Métodos

- createUser()
- getUserById()
- getUserByRFID()
- getAllUsers()
- updateUser()
- deleteUser()

---

# DoorService

Responsável pela gestão das portas.

## Métodos

- createDoor()
- getDoorById()
- getAllDoors()
- updateDoor()
- deleteDoor()

---

# RoomService

Responsável pela gestão das salas.

## Métodos

- createRoom()
- getRoomById()
- getAllRooms()
- updateRoom()
- deleteRoom()

---

# AccessLogService

Responsável pelo histórico de acessos.

## Métodos

- registerEntry()
- registerExit()
- getAccessHistory()

---

# RFIDService

Responsável pela comunicação com o leitor RFID e validação das pulseiras.

- procura o utilizador pelo RFID;
- procura a porta pelo readerId;
- verifica se a porta está ativa;
- verifica se o utilizador está ativo;
- decide se o acesso é autorizado;
- pede ao accessLogService para guardar o registo;
- devolve a resposta ("Acesso autorizado" ou "Acesso recusado")

## Métodos

- readRFID()
- validateRFID()