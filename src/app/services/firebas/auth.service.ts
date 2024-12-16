import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService { // Asegúrate de que este sea el nombre correcto
  constructor(private angularFireAuth: AngularFireAuth, private router: Router) { }

  getCurrentUser() {
    return this.angularFireAuth.currentUser; 
  }

  login(email: string, pass: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, pass);
  }

  async logout() {
    await this.angularFireAuth.signOut();
    console.log('Usuario desconectado');
    localStorage.removeItem('usuarioLogin');
    
    
  }

  getCurrentUserUid(): string | null {
    const user = this.angularFireAuth.currentUser; 
    return user ? user.uid : null; 
  }

  isLogged(): Observable<any> {
    return this.angularFireAuth.authState; 
  }

  register(email: string, pass: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pass);
  }

  recoveryPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Correo enviado!');
      })
      .catch((error) => {
        console.log('Error al enviar correo de recuperación!');
        throw error;
      });
  }
}
