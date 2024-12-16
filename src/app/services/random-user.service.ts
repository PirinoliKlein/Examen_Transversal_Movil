import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomUserService {
  private apiUrl = 'https://randomuser.me/api/?results=5'; // API de usuarios aleatorios

  constructor(private http: HttpClient) { }

  // Método para obtener usuarios aleatorios
  obtenerUsuariosAleatorios(): Observable<any> {
    return this.http.get(this.apiUrl); // Retorna el observable de la petición HTTP
  }
}