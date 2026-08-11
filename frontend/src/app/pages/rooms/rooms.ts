import { Component,OnInit, inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { RoomService } from '../../core/services/room.service';


//Interface
import { CreateRoom, Room } from '../../core/interfaces/room.interface';

//PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-rooms',
  imports: [CardModule, TableModule, ButtonModule, AvatarModule, TagModule, ProgressBarModule, RouterLink, RouterLinkActive, DialogModule, InputTextModule, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms implements OnInit {

  //1. Injeção de Serviços
    private roomService = inject (RoomService);
    private cdr = inject (ChangeDetectorRef);

  //2.Propriedades
    rooms: Room[] = [];
    filteredRooms: Room[] = [];
    searchText = "";

    //Objeto Cards
    cards = {

      totalRooms: 0,
      occupiedRooms: 0,
      freeRooms: 0,
      totalCapacity: 0,
      activeRooms: 0,
      inactiveRooms: 0,
      maintenanceRooms: 0,

    }


    displayDialog = false;
    editingRoomId: string | null = null;
    newRoom: CreateRoom = this.createEmptyRoom();
  
  //3. Método privado de inicialização para criar uma sala (objeto vazio)

    private createEmptyRoom(): CreateRoom {

      return {

        name: "",
        building: "",
        capacity: 0,
        state: "inactive"

      };
    }

  //4. LifeCycle -> Apresentação da página

    ngOnInit(): void {
      
      this.loadRooms();
    }
  
  //5. Métodos principais

    /**
     * Carrega todas as salas
     */
    loadRooms(){

      this.roomService.getAllRooms().subscribe({
      
        next: (rooms: Room[]) => {

          this.rooms = rooms;

          this.filteredRooms = [...rooms];

          this.calculateCards();

          this.cdr.detectChanges();

        },

        error: (error) => {
          console.error (error);
        }

      });

    }
    
  //6. CRUD

    /**
     * Abre o diálogo para criar um novo utilizador,
     * inicializando o formulário com valores por defeito(neste caso vazios).
     */
    openNewRoomDialog(): void {

      this.editingRoomId = null;

      this.newRoom = this.createEmptyRoom();

      this.displayDialog = true;

    }

    /**
     * Cria um nova sala e atualiza a lista
     * após a operação ser concluida com sucesso.
     */
    createRoom(): void {

      this.roomService.createRoom(this.newRoom).subscribe({

        next: () => {

          this.displayDialog = false;

          this.refreshRooms();
          
        },

        error: error =>{
          console.error(error)
        } 

      });

    }

    /**
     * Preenche o formulário com os dados enviados pelo utilizador
     * selecionando e abre o diálogo para edição
     */
    editRoom(room: Room): void {

      this.editingRoomId = room._id!; //Obrigatoriamente tem de ter um id quando crio

      this.newRoom = {

        name: room.name,

        building: room.building,

        capacity: room.capacity,

        state: room.state

      };

      this.displayDialog = true;
    }
     
    /**
     * Atualiza os dados da sala em edição
     * e recarrega a lista de salas
     */
    updateRoom(): void {
    
      if (!this.editingRoomId){
        return;
      }

      this.roomService.updateRoom(this.editingRoomId, this.newRoom).subscribe({

        next: () => {

          this.displayDialog = false;

          this.editingRoomId = null;

          this.refreshRooms();

        },

        error: (error) => {
          console.log(error)

        }

      });
    }

    /**
     * Remove uma sala e atualiza a lista
     */
    deleteRoom(id:string){

      this.roomService.deleteRoom(id).subscribe({

        next: () => { 

          this.refreshRooms();

        },
          
        error: (error) =>  {
          console.error(error)
        }

      });

    }

  //7. Métodos de filtragem

    private applyFilter(filter: (room: Room) => boolean){
     this.filteredRooms = this.rooms.filter(filter);
    }

    /**
    * Mostra todas as salas
    */
    showAllRooms(){

      this.filteredRooms = [... this.rooms];
    }

    /**
    * Filtra apenas salas ativas.
    */
    filterActiveRooms(){

      this.applyFilter(room => room.state === "active");
    }

    /**
    * Filtra apenas salas inativas.
    */
    filterInactiveRooms(){

      this.applyFilter(room => room.state === "inactive");
    }

    /**
    * Filtra apenas salas em manutenção
    */
    filterMaintenanceRooms(){
      this.applyFilter(room => room.state === "maintenance");
    }

  //9. Métodos privados auxiliares

    /**
    * Este método fecha o diálogo e atualiza a página de salas
    */
    private refreshRooms(): void {
      this.loadRooms();
    }

    /**
    * Calcula os valores apresentados nos cartões de resumo da página de salas.
    */
    private calculateCards(): void {

      this.cards.totalRooms = this.rooms.length;

      this.cards.occupiedRooms = this.rooms.filter(r => r.currentOccupancy > 0).length; //filter() percorre todas as salas e devolve apenas aquelas que cumprem a condiçao
        
      this.cards.freeRooms = this.rooms.filter(r => r.currentOccupancy === 0 ).length;

      this.cards.activeRooms = this.rooms.filter(r => r.state === "active").length;

      this.cards.inactiveRooms = this.rooms.filter(r => r.state === "inactive").length;

      this.cards.maintenanceRooms = this.rooms.filter(r => r.state === "maintenance").length;

      this.cards.totalCapacity = this.rooms.reduce((sum: number, r) => sum + r.capacity, 0 ); //Devolve a capacidade total de todas as salas

    }

  //
}
