import { RoomSummary } from './room.interface';

export interface Door {

  _id: string;

  name: string;

  location: string;

  state: "active" | "inactive";

  doorType: "hospitalEntry" | "hospitalExit" | "internal"| "";

  room: {
    _id: string;
    name: string;
  };

  readerId: string;

  createdAt?: string;

  updatedAt?: string;

}

export interface CreateDoor {

  name: string;

  location: string;

  state: "active" | "inactive";

  doorType: "hospitalEntry" | "hospitalExit" | "internal"| "";

  room: string; // ID da sala

  readerId: string;

}


export interface DoorSummary {

  _id: string;

  name: string;

  room: RoomSummary;

}