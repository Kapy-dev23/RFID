import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

/**
 * O authService é a "ponte" entre o Angular e o backend.
 */
export class AuthService {

  //Injeta o HttpClient para permitir fazer pedidos HTTP ao backend
  constructor(private http: HttpClient){}

  /**
   * URL base da API de autenticação
   * Todos os pedidos de login serao feitos para este endereço
   * 
   */
  private apiUrl = 'http://localhost:3000/api/auth';

  /**
   * Envia as credenciais do utilizador para o backend.
   * Resultado -> envia para o backend atraves da rota.
   */
  login (email: string, password: string){

    return this.http.post(`${this.apiUrl}/login`,{ email,password });
  }

}
