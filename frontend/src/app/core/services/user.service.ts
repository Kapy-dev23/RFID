import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Interface
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  //Injeta o HttpClient para permitir fazer pedidos HTTP ao backend
  constructor(private http: HttpClient){}

  /**
   * URL base da API de autenticação
   * Todos os pedidos de login serao feitos para este endereço
   */
  private apiUrl = 'http://localhost:3000/api/users';

  /**
   * Cria um utilizadord
   */
  createUser(user : any){
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Obtem todos os utilizadores
  */
 getAllUsers(){
    return this.http.get<User[]>(this.apiUrl);
 }

 /**
  * Obtem um utilizador através do rfid
  */
 getUserByRfid(rfid: string){
    return this.http.get<User[]>(`${this.apiUrl}/rfid/${rfid}`);
 }

 /**
  * Obtem um utilizador especifico
  */
 getUserById(id: string){
    return this.http.get<User[]>(`${this.apiUrl}/${id}`);
 }

 /**
  * Atualiza um utilizador atraves do seu id
  */
 updateUser(id: string, user: any){
    return this.http.put<User[]>(`${this.apiUrl}/${id}`, user);
 }

 /**
  * Elimina um utilizador atraves do seu id
  */
 deleteUser(id: string){
   return this.http.delete<User[]>(`${this.apiUrl}/${id}`);
 }

}
