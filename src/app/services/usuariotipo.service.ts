import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './firebas/usuarios.service.spec';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserUid: string | null = null;

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.authService.isLogged().subscribe((user: { uid: string | null }) => {
      if (user) {
        this.currentUserUid = user.uid;
      }
    });
  }



  private async changeUserType(tipoNuevo: string) {
    if (this.currentUserUid) {
      await this.firestore.collection('usuarios').doc(this.currentUserUid).update({ tipo: tipoNuevo });
    }
  }
}
