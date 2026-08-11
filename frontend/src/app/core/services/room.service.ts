import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Interface
import { Room,CreateRoom } from '../interfaces/room.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  //Injeta o HttpClient para permitir fazer pedidos HTTP ao backend
  constructor(private http: HttpClient){}

  /**
   * URL base da API de autenticação
   * Todos os pedidos de login serao feitos para este endereço
   */
  private apiUrl = 'http://localhost:3000/api/rooms';

  /**
   * Cria uma nova sala.
   */
  createRoom(room: CreateRoom){
    return this.http.post<Room>(this.apiUrl, room);
  }

  /**
   * Obtem todas as salas.
   */
  getAllRooms(){
    return this.http.get<Room[]>(this.apiUrl);
  }

  /**
   * Obtem uma sala pelo seu id.
   */
  getRoomById(id: string){
    return this.http.get<Room[]>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtem a ocupaçao atual de uma sala.
   */
  getCurrentOccupancy(id: string){
    return this.http.get<Room[]>(`${this.apiUrl}/${id}/occupancy`);
  }

  /**
   * Obtem o numero de salas sem porta associada.
   */
  getAvailableRooms() {
    return this.http.get<Room[]>(`${this.apiUrl}/available`);
  }


  /**
   * Atualiza uma sala atraves do seu id.
   */
  updateRoom(id: string, room: CreateRoom){
    return this.http.put<Room[]>(`${this.apiUrl}/${id}`, room);
  }

  /**
   * Elimina uma sala atraves do seu id.
   */
  deleteRoom(id: string){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 
