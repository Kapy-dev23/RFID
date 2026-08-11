import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

//Comunica com o backend
import { AuthService } from '../../core/services/auth.service';

//Imports PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule,ButtonModule, CardModule, ButtonModule, InputTextModule, PasswordModule, ToastModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  
  /**
   * Injeta o AuthService para podermos chamar os metodos
   * que comunicam com o backend
   */
  private authService = inject(AuthService);

  private messageService = inject(MessageService);

  private router = inject(Router);


    //Variáveis ligadas ao inputs do formulario.
    email  = '';
    password = '';

    /**
     * Método executado quando o utilizador
     * carrega no botão "Entrar".
     */
    login(){

      /**
       * Chama o método login() do authService.
       * Envia o email e a palavra passe para o backend
       */
      this.authService.login(this.email, this.password).subscribe({

        next: (response: any) => {
           this.messageService.add({
           severity: 'success',
           summary: 'Sucesso',
           detail: 'Login efetuado com sucesso!',
           life: 3000
        });
           
          //Guarda o token
          localStorage.setItem("token", response.token);

          //Guarda o utilizador
          localStorage.setItem("user", JSON.stringify(response.user));

          //Redireciona conforme o perfil
          if(response.user.role === "admin"){
            
            this.router.navigate(['/dashboard-admin']);

          } else if (response.user.role === "staff"){
            
            this.router.navigate(['/dashboard-staff']);
          }

        },

        error:(error: any) => {
            this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error.message
        });
        
        }

      });
    }
}
