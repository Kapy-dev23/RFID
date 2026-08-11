import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { RoomService } from '../../core/services/room.service';
import { AccessLogService } from '../../core/services/access-log.service';
import { UserService } from '../../core/services/user.service';
import { DoorService } from '../../core/services/door.service';

//PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';




@Component({
  selector: 'app-dashboard-admin',
  imports: [CardModule, TableModule, ButtonModule, AvatarModule, TagModule, DecimalPipe, DatePipe, ProgressBarModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})

export class DashboardAdmin implements OnInit {

  /**
   * Injetar serviços que vao comunicar com o backend
   */
  private roomService = inject(RoomService);

  private accessLogService = inject(AccessLogService);

  private userService = inject(UserService);

  private doorService = inject(DoorService);

  private cdr = inject(ChangeDetectorRef);

  /**
   * Variáveis que irão guardas os dados da dashboard.
   * Guarda os valores do backend.
   */

  averageWaitingTime = 0;

  totalUsers = 0;

  totalDoors = 0;

  totalRooms = 0;

  accessHistory: any[] = [];

  rooms: any[] = [];

  ngOnInit(): void {

      this.loadUsers();

      this.loadRooms();

      this.loadDoors();

      this.loadAccessHistory();

      this.loadAverageWaitingTime();
  }

  /**
   * Obtem todos os utilizadores e calcula o total.
   */
  loadUsers(){
    this.userService.getAllUsers().subscribe({

      next: (users: any) => { //a variavel users contem exatamente a resposta enviada pelo backend
        
        this.totalUsers = users.length;

        this.cdr.detectChanges();

      },

      error: (error: any) => {
        console.log(error);
      }


    });

  }

  /**
   * Obtem todas as salas e calcula o total de salas
   */
  loadRooms(){
    this.roomService.getAllRooms().subscribe({

      next: (rooms: any) => {
              
        this.rooms = rooms;

        this.totalRooms = rooms.length;

        this.cdr.detectChanges();

        //Percorre cada sala e devolve o numero de ocupaçao
        rooms.forEach((room: any) => {

          this.loadCurrentOccupancy(room._id);

        });


      },

      error: (error: any) => {

        console.error(error);

      }

    });
        
      
  }

  /**
   * Obtem todas as portas e calcula as portas.
   */
  loadDoors(){
    this.doorService.getAllDoors().subscribe({
      next:(doors: any) => {

        this.totalDoors = doors.length;

        this.cdr.detectChanges();


      },

      error: (error: any) => {

        console.error(error);
 
      }

    });

  }

  /**
   * Obtem o histórico de acessos
   */
  loadAccessHistory(){

    this.accessLogService.getAccessHistory().subscribe({
      next:(history: any) => {

        
        console.log(history);

        this.accessHistory = history.reverse();

        this.accessHistory = history.slice(0,5);

        this.cdr.detectChanges();
        


      },

      error: (error: any) => {
        
          console.error("Erro:", error);


      }

    });
  }

  /**
   * Obtem o tempo médio de espera de todo o hospital.
   */
  loadAverageWaitingTime(){
    this.accessLogService.getAverageWaitingTime().subscribe({
      next: (response: any) => {

        this.averageWaitingTime = response.averageWaitingTime;

        this.cdr.detectChanges();


      },
      
      error: (error: any) => {
        console.error(error);

      }

    });
  }

  /**
   * Obtem o numero de pessoas em cada sala (método auxiliar).
   */
  loadCurrentOccupancy(roomId: string){
    this.roomService.getCurrentOccupancy(roomId).subscribe({
      

      next: (response: any) => {

        console.log("Resposta:", response);

        /**
          * Procura dentro do array "rooms" a sala
          * cujo identificador (_id) é igual ao roomId recebido.
          */
        const room = this.rooms.find(r => r._id === roomId);

        console.log("Sala antes:", room);

        /**
          * Se encontrou a sala,
          * adiciona-lhe a ocupação recebida do backend.
          */
        if(room){

          room.currentOccupancy = response.currentOccupancy;

        }

        this.cdr.detectChanges();
        


      },

      error: (error: any) => {
        console.error(error);

      }

    });

  }

}
