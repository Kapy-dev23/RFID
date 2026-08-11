import { HttpInterceptorFn } from '@angular/common/http';
/**
 * O interceptor vai colocar automaticamente o token em todos os pedidos para que nao seja
 * preciso de fazer isto manualmente em todos os serviços
 * 
 * Adiciona automaticamente o token JWT
 * a todos os pedidos enviados para o backend
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  //Obter o token guardado após o login.
  let token: string | null = null;

  // Verificar se está a correr no browser
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  //Se existir token, adiciona-o ao cabeçalho Authorization.
  if(token){

    req = req.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`

      }

    });

  }

   return next(req);
};
