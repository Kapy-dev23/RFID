import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccessLog } from '../interfaces/accessLog.interface';

@Injectable({
  providedIn: 'root',
})
export class AccessLogService {

  //Injeta o HttpClient para permitir fazer pedidos HTTP ao backend
  constructor(private http: HttpClient){}

  /**
   * URL base da API de autenticação
   * Todos os pedidos de login serao feitos para este endereço
   */
  private apiUrl = 'http://localhost:3000/api/access';

  /**
   * Obtem o tempo médio de espera de uma sala
   */
  getAverageWaitingTime(){
    return this.http.get<AccessLog>(`${this.apiUrl}/average`);
  }

  /**
   * Obtem o histórico de acessos.
   */
  getAccessHistory(){
    return this.http.get<AccessLog[]>(`${this.apiUrl}`);
  }


}
