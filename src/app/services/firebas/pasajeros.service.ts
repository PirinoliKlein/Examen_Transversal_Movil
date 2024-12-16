import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class PasajerosService {

  constructor(private angularFireAuth: AngularFireAuth) { }
  

  login(email: string, pass: string){
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass);
  }

  logout(){
    return this.angularFireAuth.signOut();

  }

  register(email: string, pass: string){
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pass);

  }

  recoveryPassword(email: string){
    return this.angularFireAuth.sendPasswordResetEmail(email)
    .then(() => {
        console.log('Correo enviado!');
    })
    .catch((error) =>{
        console.log('Error al enviar orreo de recuperacion!');
        throw error;
    })
    

  }
}
