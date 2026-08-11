import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RfidService {

  //Injeta o HttpClient para permitir fazer pedidos HTTP ao backend
  constructor(private http: HttpClient){}

  /**
   * URL base da API de autenticação
   * Todos os pedidos de login serao feitos para este endereço
   */
  private apiUrl = 'http://localhost:3000/api/rfid';

  /**
   * Regista um acesso através da leitura da pulseira RFID.
   */
  registerAccess(data: any) {
    return this.http.post(`${this.apiUrl}/access`, data);
  }


}
