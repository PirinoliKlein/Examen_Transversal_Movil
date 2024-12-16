import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from 'src/app/services/firebas/viajes.service';
@Component({
  selector: 'app-viaje-en-curso',
  templateUrl: './viaje-en-curso.page.html',
  styleUrls: ['./viaje-en-curso.page.scss'],
})
export class ViajeEnCursoPage implements OnInit {

  viajeUid!: string;
  viajeData: any; 

  constructor(private route: ActivatedRoute,
    private viajeService: ViajeService) { }

  ngOnInit() {
    this.viajeUid = this.route.snapshot.paramMap.get('uid') || '';

    // Obtener los detalles del viaje usando el 'uid'
    this.viajeService.getViaje(this.viajeUid).subscribe(data => {
      this.viajeData = data;
      console.log('Datos del viaje:', this.viajeData);
    });
  }

}
