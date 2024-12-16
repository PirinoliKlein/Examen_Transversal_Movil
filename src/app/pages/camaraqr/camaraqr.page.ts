import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camaraqr',
  templateUrl: './camaraqr.page.html',
  styleUrls: ['./camaraqr.page.scss'],
})
export class CamaraqrPage implements OnInit {

  isSupported = false;
  barcodes: string[] = [];  // Usamos un array de strings para almacenar los resultados del QR

  constructor(
    private alertController: AlertController,
    private router: Router
  ) { }

  async ngOnInit() {
    // Verifica si el escaneo de códigos QR es compatible
    const { supported } = await BarcodeScanner.isSupported();
    this.isSupported = supported;
    console.log('Escaneo de código QR soportado:', this.isSupported);

    if (!this.isSupported) {
      await this.presentAlert('El escaneo de códigos QR no es compatible en tu dispositivo.');
    }
  }

  async startScan() {
    try {
      // Solicitamos permisos de cámara
      const cameraPermissions = await BarcodeScanner.requestPermissions();
      if (cameraPermissions.camera !== 'granted') {
        await this.presentAlert('Permisos de cámara no concedidos.');
        return;
      }
  
      // Activamos el escáner
      document.querySelector('body')?.classList.add('barcode-scanner-active');
  
      // Escuchamos el evento cuando un código QR es escaneado
      const listener = await BarcodeScanner.addListener('barcodeScanned', (result) => {
        console.log('Resultado escaneado:', result);  // Muestra el objeto completo para depuración
  
        // Asegúrate de que el valor de rawValue esté en result.barcode.rawValue
        const barcodeContent = result?.barcode?.rawValue || '';  // Accede a rawValue dentro de barcode
  
        console.log('Contenido del código QR:', barcodeContent);  // Muestra solo el contenido
  
        if (barcodeContent) {
          // Agregar el código QR escaneado al array de barcodes
          this.barcodes.push(barcodeContent);
  
          // Redirigir al viaje en curso con el ID que obtuviste del QR
          this.navigateToViajeEnCurso(barcodeContent);
        }
      });
  
      // Iniciar el escaneo
      await BarcodeScanner.startScan();
    } catch (error) {
      console.error('Error al iniciar el escaneo:', error);
      await this.presentAlert('Error al iniciar el escaneo. Asegúrate de que la cámara esté disponible.');
    }
  }

  async stopScan() {
    // Detener el escaneo
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    await BarcodeScanner.removeAllListeners();
    await BarcodeScanner.stopScan();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Función para redirigir al viaje en curso
  private navigateToViajeEnCurso(viajeId: string) {
    // Verifica si el ID del viaje existe
    if (viajeId) {
      // Redirige al usuario a la página de ViajeEnCurso, pasando el ID como parámetro
      this.router.navigate([`/viaje-en-curso`, viajeId]);  // Usa el ID del viaje aquí
    } else {
      this.presentAlert('Código QR no válido.');
    }
  }
}
