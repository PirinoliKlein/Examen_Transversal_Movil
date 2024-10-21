import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }

  mensaje(msj: any, icon: any, title: any){
    Swal.fire({
      icon: icon,
      title: title,
      text: msj,
      heightAuto: false
    })

  }

  succes() {
    
  }

  error(){

  }

  info(){

  }

  warning(){

  }

  mixin(timer: any, msj: any, icon: any){
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: msj,
      heightAuto: false
    });
  }
}
