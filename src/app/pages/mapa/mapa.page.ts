import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Direccion } from 'src/app/folder/interfaces/Direccion';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { viajes } from 'src/app/folder/interfaces/Viajes';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ViajeService } from 'src/app/services/firebas/viajes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';
import { IonRouterOutlet } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/firebas/usuarios.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  private readonly CHILE_BOUNDS = {
    north: -17.5,
    south: -56.0,
    east: -66.0,
    west: -75.0
  };

  direccion: string = '';
  ruta = 'https://api.mapbox.com/geocoding/v5/mapbox.places/XXXXX.json?access_token=pk.eyJ1IjoiZnJlZGNhbXBvczEyMzAiLCJhIjoiY2xudTl2d2VrMDlpbzJrcWpnYnJkc3JqbCJ9.hjid1kkpkU37wvVJrj2pQg';
  geometria = 'https://api.mapbox.com/directions/v5/mapbox/driving/-70.57881856510504,-33.59844199173414;LNG,LAT?geometries=geojson&access_token=pk.eyJ1IjoicGFibGl0bzY2NiIsImEiOiJjbTJmZHBrMGswOGp2Mmtvb25wbGM5bmM1In0.NPJSxRjMFuRwIQb2KxkZzw';
  map?: mapboxgl.Map;
  mis_direcciones: Direccion[] = [];
  marker?: mapboxgl.Marker;
  currentRouteLayerId = 'route';
  conductorForm: FormGroup;
  currentUserUid: string | null = null;
  formInvalid: boolean = false; // Nueva propiedad para manejar la validez del formulario

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private firestore: AngularFirestore,
    private viajeService: ViajeService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ionOutlet: IonRouterOutlet,
    private usuariosService: UsuariosService
  ) {
    this.conductorForm = this.formBuilder.group({
      precio: [null, [Validators.required, Validators.min(1000), Validators.max(10000)]],
      capacidad: [null, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    this.authService.isLogged().subscribe((user: { uid: string | null; }) => {
      if (user) {
        this.currentUserUid = user.uid;
        console.log('UID del usuario:', this.currentUserUid);
      }
    });

    if (this.ionOutlet) {
      this.ionOutlet.swipeGesture = false;
    }
  }

  ionViewWillEnter() {
    this.mapa();
  }

  ionViewWillLeave() {
    if (this.ionOutlet) {
      this.ionOutlet.swipeGesture = true;
    }
  }

  borrar() {
    this.mis_direcciones = [];
    this.mapa();
  }

  mapa() {
    this.map = new mapboxgl.Map({
      accessToken: environment.firebaseConfig.MAPBOX_ACCESS_TOKEN,
      container: 'mapa-box',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.57881856510504, -33.59844199173414],
      zoom: 16
    });

    new mapboxgl.Marker({ color: 'Black' })
      .setLngLat([-70.57881856510504, -33.59844199173414])
      .addTo(this.map);
  }

  async buscar() {
    const nueva_ruta = this.ruta.replace(/XXXXX/g, this.direccion);
    this.http.get(nueva_ruta).subscribe((data) => {
      const direcciones = JSON.parse(JSON.stringify(data))["features"];
      for (let index = 0; index < direcciones.length; index++) {
        const element = direcciones[index];
  
        // Crear un objeto de tipo Direccion
        const dire: Direccion = {
          nombre: element.place_name,    // Asigna place_name como nombre
          lng: element.center[0],       // Longitud de la dirección
          lat: element.center[1]        // Latitud de la dirección
        };
  
        // Verifica si la dirección está dentro de Chile
        if (this.estaDentroDeChile(dire.lat, dire.lng)) {
          this.mis_direcciones.push(dire);
        } else {
          console.warn(`La dirección ${dire.nombre} no está dentro de Chile.`);
          this.mostrarAlertaFueraDeChile(dire.nombre);
        }
      }
    });
  }

  estaDentroDeChile(lat: number, lng: number): boolean {
    return lat <= this.CHILE_BOUNDS.north && lat >= this.CHILE_BOUNDS.south &&
           lng <= this.CHILE_BOUNDS.east && lng >= this.CHILE_BOUNDS.west;
  }

  async mostrarAlertaFueraDeChile(direccion: string) {
    const toast = await this.toastController.create({
      message: `La dirección "${direccion}" está fuera de Chile.`,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }

  direccion_seleccionada(ev: any) {
    const selectedValue = ev.detail.value;
    if (selectedValue && selectedValue.lng && selectedValue.lat) {
      const lng = selectedValue.lng;
      const lat = selectedValue.lat;
      if (this.estaDentroDeChile(lat, lng)) {
        let nuevaGeometria = this.geometria.replace('LNG', lng).replace('LAT', lat);
        this.marcador(lng, lat);
        this.generar_ruta(nuevaGeometria);
      } else {
        console.error('La ubicación seleccionada está fuera de Chile:', selectedValue);
        this.mostrarAlertaFueraDeChile(selectedValue.nombre);
      }
    } else {
      console.error('La dirección seleccionada no tiene coordenadas válidas:', selectedValue);
    }
  }

  marcador(lng: number, lat: number) {
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .addTo(this.map!);
  }

  generar_ruta(geometria: string) {
    this.http.get(geometria).subscribe((data: any) => {
      if (this.map!.getLayer(this.currentRouteLayerId)) {
        this.map!.removeLayer(this.currentRouteLayerId);
        this.map!.removeSource(this.currentRouteLayerId);
      }

      this.map!.addSource(this.currentRouteLayerId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: data.routes[0].geometry,
          properties: {}
        }
      });

      this.map!.addLayer({
        id: this.currentRouteLayerId,
        type: 'line',
        source: this.currentRouteLayerId,
        layout: {
          "line-cap": 'round',
          "line-join": 'round'
        },
        paint: {
          "line-color": 'black',
          "line-width": 3
        }
      });
    });
  }

  async guardarViaje() {
    this.formInvalid = false; 
    if (this.conductorForm.valid) {
      const formData = this.conductorForm.value;
  
      // Asegúrate de que tengas al menos dos direcciones (origen y destino)
      if (this.mis_direcciones.length < 2) {
        const toast = await this.toastController.create({
          message: 'Debes seleccionar al menos dos direcciones (origen y destino).',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        return; // No proceder si no hay suficientes direcciones
      }
  
      // Asigna las direcciones seleccionadas (origen y destino)
      const inicioRuta = this.mis_direcciones[0];  // Dirección de inicio
      const destinoRuta = this.mis_direcciones[1];  // Dirección de destino
  
      // Crear el objeto viaje
      const nuevoViaje: viajes = {
        precio: formData.precio,
        pasajeros: formData.capacidad,
        direccion: inicioRuta.nombre,  // Usamos el nombre de la dirección de inicio
        ruta: {
          inicio: {
            lat: inicioRuta.lat,
            lng: inicioRuta.lng,
            nombre: inicioRuta.nombre // Aquí usamos nombre también
          },
          destino: {
            lat: destinoRuta.lat,
            lng: destinoRuta.lng,
            nombre: destinoRuta.nombre // Aquí también
          },
          geometria: 'rutaGeometria',  // Aquí puedes usar el cálculo de la geometría real si es necesario
          distancia: 15,  // Distancia estimada en km (puedes calcular esto con la API de Mapbox)
          duracion: 20    // Duración estimada en minutos
        }
      };
  
      try {
        // Guardar el viaje en Firestore
        const viajeRef = await this.firestore.collection('viajes').add(nuevoViaje);
        nuevoViaje.uid = viajeRef.id; 
  
        // Actualizar el documento con el UID del viaje
        await this.firestore.collection('viajes').doc(nuevoViaje.uid).update({ uid: nuevoViaje.uid });
  
        const toast = await this.toastController.create({
          message: 'Viaje creado correctamente!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
  
        // Redirigir a la página de QR para generar el código QR
        this.router.navigate(['codigoqr', viajeRef.id]); 
      } catch (error) {
        console.error('Error al crear el viaje:', error);
        const toast = await this.toastController.create({
          message: 'Error al crear el viaje, inténtalo nuevamente.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    } else {
      this.formInvalid = true; // Indica que el formulario es inválido
      console.error('Error al enviar el formulario');
    }
  }
  

  async changeUserType(tipoNuevo: string) {
    if (this.currentUserUid) {
      try {
        await this.usuariosService.changeUserType(this.currentUserUid, tipoNuevo);
        console.log('Tipo de usuario actualizado a:', tipoNuevo);
      } catch (error) {
        console.error('Error al cambiar tipo de usuario:', error);
      }
    }
  }

  onSubmit() {
    if (this.conductorForm.valid) {
      console.log('Formulario enviado', this.conductorForm.value);
      this.guardarViaje();
    } else {
      console.error('Error al enviar el formulario');
    }
  }

  get capacidadInvalid() {
    const capacidadControl = this.conductorForm.get('capacidad');
    return capacidadControl?.touched && capacidadControl.invalid;
  }

  get precioInvalid() {
    const precioControl = this.conductorForm.get('precio');
    return precioControl?.touched && precioControl.invalid;
  }

  get precioErrorMessage() {
    const precioControl = this.conductorForm.get('precio');
    if (precioControl?.errors?.['required']) {
      return 'El precio es requerido';
    }
    if (precioControl?.errors?.['min']) {
      return 'El precio debe ser al menos 1000';
    }
    if (precioControl?.errors?.['max']) {
      return 'El precio no puede ser mayor de 10000';
    }
    return '';
  }

  get capacidadErrorMessage() {
    const capacidadControl = this.conductorForm.get('capacidad');
    if (capacidadControl?.errors?.['required']) {
      return 'La capacidad es requerida';
    }
    if (capacidadControl?.errors?.['min']) {
      return 'La capacidad debe ser al menos 1';
    }
    if (capacidadControl?.errors?.['max']) {
      return 'La capacidad no puede ser mayor de 5';
    }
    return '';
  }
}
