import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Interface
import { CreateDoor, Door } from '../../core/interfaces/door.interface'

@Injectable({
  providedIn: 'root',
})
export class DoorService {

  //Injeta o HttpClient para permitir fazer pedidos HTTP ao backend
  constructor(private http: HttpClient){}

  /**
   * URL base da API de autenticação
   * Todos os pedidos de login serao feitos para este endereço
   */
  private apiUrl = 'http://localhost:3000/api/doors';

  /**
   * Cria uma nova porta.
   */
  createDoor(door: CreateDoor){
    return this.http.post<Door>(this.apiUrl,door);
  }

  /**
   * Obtem todas as portas.
   */
  getAllDoors(){
    return this.http.get<Door[]>(this.apiUrl);
  }

  /**
   * Obtem uma porta pelo seu id.
   */
  getDoorById(id: string){
    return this.http.get<Door[]>(`${this.apiUrl}/${id}`);
  }

  /**
   * Atualiza uma porta atraves do seu id.
   */
  updateDoor(id: string, door: CreateDoor){
    return this.http.put<Door>(`${this.apiUrl}/${id}`, door);
  }

  /**
   * Elimina uma porta atraves do seu id.
   */
  deleteDoor(id:string){
     return this.http.delete<Door[]>(`${this.apiUrl}/${id}`);
  }

}
