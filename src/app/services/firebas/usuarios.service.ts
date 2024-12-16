import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './usuarios.service.spec'; 
import { MensajesService } from '../mensajes.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private mensajesService: MensajesService 
  ) { }

  async generarUsuariosAleatorios() {
   
    this.mensajesService.mixin(10000, 'Generando usuarios...', 'info');
  
    try {
      const response: any = await this.http.get('https://randomuser.me/api/?results=5').toPromise();
      const usuarios = response.results;
  
      for (let i = 0; i < usuarios.length; i++) {
        const usuario = usuarios[i];
        const tipo = Math.random() > 0.5 ? 'conductor' : 'pasajero';
        const email = `${usuario.name.first.toLowerCase()}.${usuario.name.last.toLowerCase()}@${tipo}.cl`;
  
       
        await this.authService.register(email, '123456'); 
  
       
        await this.firestore.collection('usuarios').doc(email).set({
          uid: email, 
          nombre: `${usuario.name.first} ${usuario.name.last}`,
          email: email,
          pass: '123456',
          tipo: tipo,
          direccion: `${usuario.location.street.name} ${usuario.location.street.number}`,
          telefono: usuario.phone,
          imagen: usuario.picture.thumbnail
        });
      }
  
      return 'Cuentas aleatorias creadas correctamente!';
    } catch (error: any) { 
      console.error('Error al crear cuentas aleatorias:', error);
  
      
      const errorMessage = error.message ? error.message : 'Error desconocido';
      this.mensajesService.mensaje(`Error: ${errorMessage}`, 'error', 'Error al generar usuarios');
  
      throw error; 
    }
  }

  async changeUserType(uid: string, tipoNuevo: string) {
    if (uid) {
      try {
        await this.firestore.collection('usuarios').doc(uid).update({ tipo: tipoNuevo });
      } catch (error) {
        console.error('Error al actualizar el tipo de usuario:', error);
      }
    } else {
      console.warn('UID no proporcionado');
    }
  }
  
  
}
