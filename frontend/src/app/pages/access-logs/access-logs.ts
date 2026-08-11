import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AccessLogService } from '../../core/services/access-log.service';

//Interfaces

import { AccessLog } from '../../core/interfaces/accessLog.interface';

import { DoorSummary } from '../../core/interfaces/door.interface';

import { RoomSummary } from '../../core/interfaces/room.interface';

//PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Rooms } from '../rooms/rooms';



@Component({
  selector: 'app-access-logs',
  imports: [TableModule, ButtonModule, AvatarModule, TagModule, InputTextModule, FormsModule, DialogModule, RouterLink, RouterLinkActive, DatePipe, SelectModule],
  templateUrl: './access-logs.html',
  styleUrl: './access-logs.css',
})

export class AccessLogs implements OnInit {

  //1. Serviços de Injeção

    private accessLogService = inject (AccessLogService);
    private cdr = inject (ChangeDetectorRef);

  //2. Propriedades
    accessLogs: AccessLog[] = [];

    allAccessLogs: AccessLog[] = [];

    rooms: RoomSummary[] = [];

    doors: DoorSummary[] = [];

    types = [
      { label: 'Entrada', value: 'enter' },
      { label: 'Mudança de Sala', value: 'move' },
      { label: 'Saída', value: 'exit' },
    ];

    searchUser = '';

    selectedRoom: string | null = null;

    selectedDoor: string | null = null;

    selectedType: string | null = null;

    startDate: Date | null = null;

    endDate: Date | null = null;

  
    cards = {

      totalAccess: 0,
      entries: 0,
      exits: 0,
      accessDenied: 0

    }
    
  //3. LifeCycle -> Apresentação da página

    ngOnInit(): void {

      this.loadAccessLogs();

    }

  //4. Métodos principais

    loadAccessLogs(){

      this.accessLogService.getAccessHistory().subscribe({

        next: (data: AccessLog[]) => {


          this.allAccessLogs = data; // Guarda todos os acessos originais para aplicar filtros.

          this.accessLogs = [... data]; 

          this.loadRooms();

          this.loadDoors();
        
          this.calculateCards();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(error);

        }
      });
    }
  //Métodos

    /**
    * Carrega a lista de salas sem repetição
    */
    loadRooms(): void {

      this.rooms = [... new Map (this.allAccessLogs
        .filter(log => log.door?.room)
        .map(log => [log.door.room._id, log.door.room])
      ).values()]
  
    }

    /**
    * Carrega a lista de portas sem repetição
    */
    loadDoors(): void {
      this.doors = [... new Map(this.allAccessLogs
        .filter(log => log.door)
        .map(log => [log.door._id, log.door])
      ).values()]
    }

    /**
    * Atualiza os valores apresentados nos cartões do histórico de acessos.
    */
    calculateCards(): void {

      this.cards.totalAccess = this.accessLogs.length;

      this.cards.entries = this.accessLogs.filter(log => log.type === "enter").length;

      this.cards.exits = this.accessLogs.filter(log => log.type === "exit").length;

      this.cards.accessDenied = this.accessLogs.filter(log => !log.authorised).length;
    }

    /**
    * Filtragem de valores apresentados
    */
    filterByCard(filter: string): void {

      switch (filter) {

        case 'all':
            this.accessLogs = [... this.allAccessLogs];
            break;
      
        case 'enter':
            this.accessLogs = this.allAccessLogs.filter(log => log.type === "enter");
            break;

        case 'exit':
            this.accessLogs = this.allAccessLogs.filter(log => log.type === "exit");
            break;
      
        case 'denied':
            this.accessLogs = this.allAccessLogs.filter (log => !log.authorised);
            break; 
      }

    }

    /**
    * Faz a procura em base do que o utilizador colocou
    */
    search(): void {

      this.accessLogs = this.allAccessLogs.filter(log => {

        const userMatch = 
          !this.searchUser ||
          `${log.user?.firstName} ${log.user?.lastName}`
          .toLowerCase()
          .includes(this.searchUser.toLowerCase());
      
        const roomMatch = 
          !this.selectedRoom ||
          log.door?.room?._id === this.selectedRoom;
      
        const doorMatch = 
          !this.selectedDoor ||
          log.door?._id === this.selectedDoor;

        const typeMatch =
          !this.selectedType ||
          log.type === this.selectedType;
      
        const logDate = new Date(log.date);

        const startDateMatch =
          !this.startDate ||
          logDate > new Date (this.startDate);

        const endDateMatch =
          !this.endDate ||
          logDate <= new Date (this.endDate);
      
        return userMatch &&
              roomMatch &&
              doorMatch &&
              typeMatch &&
              startDateMatch &&
              endDateMatch;
      });

    }

    /**
   * Limpa o filtro (apaga todas as opçoes selecionadas)
   */
  clearFilters(): void {

    this.searchUser = '';

    this.selectedRoom = '';

    this.selectedDoor = '';

    this.selectedType = '';

    this.startDate = null;

    this.endDate = null;

    this.accessLogs = [...this.allAccessLogs];

  }

  
}
