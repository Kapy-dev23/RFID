import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

//Serviços
import { DoorService } from '../../core/services/door.service';
import { RoomService } from '../../core/services/room.service';

//Interfaces
import { Door, CreateDoor } from '../../core/interfaces/door.interface'
import { Room } from '../../core/interfaces/room.interface'

//PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';



@Component({
  selector: 'app-doors',
  imports: [TableModule, ButtonModule, AvatarModule, TagModule, InputTextModule, FormsModule, DialogModule, RouterLink, RouterLinkActive, SelectModule],
  templateUrl: './doors.html',
  styleUrl: './doors.css',
})
export class Doors implements OnInit {

  //1. Serviços de Injeção

    private doorService = inject (DoorService);
    private roomService = inject (RoomService);
    private cdr = inject (ChangeDetectorRef);

  //2. Propriedades
  
    searchText = "";
    doors: Door[] = [];
    filteredDoors: Door[] = [];
    availableRooms: Room[] = [];

    //Objeto Cards
    cards = {
      totalDoors: 0,
      activeDoors: 0,
      inactiveDoors: 0
    }

    displayDialog = false;
    editingDoorId: string | null = null;
    newDoor: CreateDoor = this.createEmptyDoor();
  
  //3. Método privado de inicialização

    private createEmptyDoor(): CreateDoor {
      return {
        name: "",
        location: "",
        room: "",
        readerId: "",
        state: "active",
        doorType: ""
      }
    }
 
  //4. LifeCycle -> apresentação da página

    ngOnInit(): void {
      this.loadDoors();
    }
  
  //5. Métodos Principais

    /**
    * Carrega todos os utilizadores
    */
    loadDoors(){

      this.doorService.getAllDoors().subscribe({

        next: (doors: Door[]) => {

          this.doors = doors;
          this.filteredDoors = [... doors];

          this.calculateCards();
          this.cdr.detectChanges();

        },

        error: (error) => {
          console.log(error);
        }

      });

    }

  //6. CRUD

    /**
    * Abre o diálogo para criar uma nova porta,
    * inicializando o formulário com valores por defeito(neste caso vazios)
    */
    openNewDoorDialog(): void {

      this.editingDoorId = null;

      this.newDoor = this.createEmptyDoor();

      this.loadAvailableRooms();

      this.displayDialog = true;

    }


    /**
    * Carrega todos os quartos disponiveis.
    */
    loadAvailableRooms(): void {

      this.roomService.getAvailableRooms().subscribe({

        next: (rooms: Room[]) => {

          this.availableRooms = rooms;

        },

        error: (error) => {

          console.log(error);

        }

      });
    }

    /**
     * Cria uma nova porta e atualiza a lista
     * após a operação ser concluida com sucesso.
     */
    createDoor(): void {

      this.doorService.createDoor(this.newDoor).subscribe({

        next: () => {

          this.displayDialog = false;

          this.refreshDoors();

        },

        error: (error) => {

          console.log(error);

        }

      });
    }

    /**
     * Preenche o formulário com os dados da porta
     * selecionando e abre o diálogo para ediçao
     */
    editDoor(door: Door){

      this.loadAvailableRooms();

      this.editingDoorId = door._id;

      this.newDoor = {

        name: door.name,

        location: door.location,

        room: door.room._id,

        readerId: door.readerId,

        state: door.state,

        doorType: door.doorType

      }

      this.displayDialog = true;

    }

    updateDoor(){

      if(!this.editingDoorId){
        return;
      }

      this.doorService.updateDoor(this.editingDoorId!, this.newDoor).subscribe({

        next: () => {

          this.displayDialog = false;

          this.editingDoorId = null;

          this.refreshDoors();

        },

        error: (error) => {

          console.log(error);

        }

      });
    }

    deleteDoor(id: string){

      this.doorService.deleteDoor(id).subscribe({

        next: () => {

          this.refreshDoors();

        },

        error: (error) => {

          console.log(error);

        }

      });
    }

    /**
    * Altera o estado da porta entre ativo e inativo e atualiza a lista de portas
    */
    toggleDoorStatus(door: Door): void {

     const updatedDoor: CreateDoor = {
        name: door.name,
        location: door.location,
        state: door.state === "active" ? "inactive" : "active",
        doorType: door.doorType,
        room: door.room._id,
        readerId: door.readerId
      };

      this.doorService.updateDoor(door._id, updatedDoor).subscribe({

        next: () => {

          this.refreshDoors();

        },

        error: (error) => {

          console.log(error);

        }
      });

    }

  //7. Pesquisa

    /**
    * Pesquisa utilizadores pelo nome
    */
    search(): void {

      const text = this.searchText.toLowerCase();

      this.filteredDoors = this.doors.filter (door => {
        
      return (
        door.name.toLowerCase().includes(text)||
        door.location.toLowerCase().includes(text)
      );

      });

    }

  //8. Métodos de filtragem


    private applyFilter(filter: (door: Door) => boolean){

      this.filteredDoors = this.doors.filter(filter);

    }

    /**
     * Mostra todas as portas
     */
    showAllDoors(){
      this.filteredDoors = [... this.doors];
    } 

    /**
     * Filtra pelas portas ativas
     */
    filterActiveDoors(){
      this.applyFilter(d => d.state === "active");
    }

    /**
     * Filtra pelas portas inativas.
     */
    filterInactiveDoors(){
      this.applyFilter(d => d.state === "inactive")
    }
  
  //9. Métodos privados auxiliares

    /**
    * Este método privado fecha o diálogo e atualiza a lista de portas
    */
    private refreshDoors(): void {
      this.loadDoors();
    }

    /**
    * Calcula os valores apresentados nos cartões de resumo da página de portas
    */
    private calculateCards(): void {

      this.cards.totalDoors = this.doors.length;

      this.cards.activeDoors = this.doors.filter(d => d.state === "active").length;
      this.cards.inactiveDoors = this.doors.filter(d => d.state === "inactive").length;
    }

  //


}
