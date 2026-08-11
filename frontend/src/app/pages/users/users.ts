import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

//Serviço
import {UserService} from '../../core/services/user.service';

//Interface
import { User } from '../../core/interfaces/user.interface';

//PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-users',
  imports: [TableModule, ButtonModule, AvatarModule, TagModule, InputTextModule, FormsModule, DialogModule, RouterLink, RouterLinkActive],
  templateUrl: './users.html',
  styleUrl: './users.css',
})


export class Users implements OnInit{

  //1. Injeção de Serviços

    private userService = inject (UserService);
    private cdr = inject (ChangeDetectorRef)

  //2. Propriedades

    searchText = ""; //Pesquisa
    users: User[] = []; // Lista de utilizadores
    filteredUsers: User[] = []; // Lista de utilizadores filtrados

    //Objeto Cards
    cards = {
      totalUsers: 0,
      doctors: 0,
      nurses: 0,
      receptionists: 0,
      patients: 0,
      visitors: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      staff: 0
    };

    displayDialog = false; //Lista para criar utilizador
    editingUserId: string | null = null; //Esta variável permite editar quando clico em algum utilizador
    newUser = this.createEmptyUser(); //Dados do formulários (inicialização da variável)
  
  //3. Método privado de inicialização

    //Método privado para criar apenas um objeto vazio no formulário.
    private createEmptyUser() {

      return {
        firstName: "",

        lastName: "",

        email: "",

        password: "",

        rfid: "",

        role: "",

        active: true

      }
    }
  
  //4. LifeCycle -> Apresentação da página

    ngOnInit(): void {

      this.loadUsers();
       
    }

  //5. Métodos principais

    /**
    * Carrega todos os utilizadores
    */
    loadUsers(){

      this.userService.getAllUsers().subscribe({

        //Os dados que vierem do backend devem ter a estrutura da interface
        next: (users: User[]) => {

          this.users = users;

          //A tabela começa por mostrar todos os utilizadores
          this.filteredUsers = [... users];

          this.calculateCards();
        
          this.cdr.detectChanges();

        },
 
        error: (error: any) => {
          console.error(error);
        }
      
      });
    }
  
  //6. CRUD


    /**
     * Abre o diálogo para criar um novo utilizador,
     * inicializando o formulário com valores por defeito(neste caso vazios).
     */
    openCreateDialog(): void {

      this.editingUserId = null;

      this.newUser = this.createEmptyUser();

      this.displayDialog = true;
    
    }

    /**
     * Cria um novo utilizador e atualiza a lista
     * após a operação ser concluida com sucesso.
     */
    createUser(): void {

      this.userService.createUser(this.newUser).subscribe({

        next:() => {

          this.displayDialog = false;

          this.refreshUsers();

        },

        error: error => {
          console.error(error);
        }

      });

    
    }

    /**
     * Preenche o formulário com os dados do utilizador
     * selecionando e abre o diálogo para edição
     */
    editUser(user: User): void {

      this.editingUserId = user._id;

      this.newUser = {
      
        firstName: user.firstName,

        lastName: user.lastName,

        email: user.email,

        password: "",

        rfid: user.rfid,

        role: user.role,

        active: user.active

      };

      this.displayDialog = true;

    }

    /**
     * Atualiza os dados do utilizador em edição
     * e recarrega a lista de utilizadores
     */
    updateUser(){

      if(!this.editingUserId){
        return;
      }

      this.userService.updateUser(this.editingUserId!, this.newUser).subscribe({

        next: () => {

          this.displayDialog = false;

          this.editingUserId = null;

          this.refreshUsers();

        },

        error: (error) => {
          console.log(error);
        }

      });

    }

    /**
     * Remove um utilizador e atualiza a lista
     */
    deleteUser(id: string){
      this.userService.deleteUser(id).subscribe({

        next: () => {

          this.refreshUsers();

        },

        error: (error) => {

          console.error(error);

        }
      });
    }

    /**
     * Altera o estado do utilizador entre ativo e inativo
     * e atualiza a lista de utilizadores
     */
    toggleUserStatus(user: User){

      const updatedUser = {
        ...user,
        active: !user.active
      };

      this.userService.updateUser(user._id, updatedUser).subscribe({

        next: () => {

          this.refreshUsers();

        },

        error: (error) => {
          console.error(error);
        }

      });

    }
  
  //7. Pesquisa

    /**
    * Pesquisa utilizadores pelo nome.
    */
    search(): void {

      this.filteredUsers = this.users.filter (user => {
    
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

        return fullName.includes(this.searchText.toLowerCase());
      
      });
    }

  //8. Métodos de filtragem

    private applyFilter(filter: (user: User) => boolean){

      this.filteredUsers = this.users.filter(filter);

    }

    /**
    * Mostra todos os utilizadores.
    */
    showAllUsers(){

      this.filteredUsers = [...this.users];

    }

    /**
    * Filtra utilizadores por função
    */
    filterByRole(role:string){
    
      this.applyFilter(user => user.role === role);

    }

    /**
    * Filtra apenas utilizadores ativos.
    */
    filterActiveUsers(){

      this.applyFilter(user => user.active);

    }


    /**
    * Filtra apenas utilizadores inativos.
    */
    filterInactiveUsers(){

      this.applyFilter(user => !user.active);

    }

  //9. Métodos privados auxiliares

    /**
    * Este método privado fecha o diálogo e atualiza a lista de utilizadores.
    */
    private refreshUsers(): void {
    
      this.loadUsers();

    }

    /**
    * Calcula os valores apresentados nos cartões de resumo da página de utilizadores.
    */
    private calculateCards(): void {

      this.cards.totalUsers = this.users.length;

      this.cards.activeUsers = this.users.filter(u => u.active).length;
      this.cards.inactiveUsers = this.users.filter(u => !u.active).length;

      this.cards.doctors = this.users.filter(u => u.role === "doctor").length;
      this.cards.nurses = this.users.filter(u => u.role === "nurse").length;
      this.cards.receptionists = this.users.filter(u => u.role === "receptionist").length;
      this.cards.patients = this.users.filter(u => u.role === "patient").length;
      this.cards.visitors = this.users.filter(u => u.role === "visitor").length;

    }
    
  //

}
