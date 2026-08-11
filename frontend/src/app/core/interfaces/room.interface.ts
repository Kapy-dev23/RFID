export interface Room {
  _id?: string; //Como é o mongoDb que gera o id, colocamos ponto de interrogaçao a indicar que sempre que crio uma sala o mongoDb gera um id (não eu manualmente)

  name: string;

  building: string;

  capacity: number;

  currentOccupancy: number;

  state: "active" | "inactive" | "maintenance";

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateRoom {
  name: string;
  building: string;
  capacity: number;
  state: "active" | "inactive" | "maintenance";
}

export interface RoomSummary {

  _id: string;

  name: string;

}