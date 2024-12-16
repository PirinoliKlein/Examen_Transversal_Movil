export interface viajes {
    uid?: string;               // El ID único del viaje, se genera al guardar en Firebase
    precio: number | null;      // Precio del viaje
    pasajeros: number | null;   // Capacidad de pasajeros
    direccion: string;          // Dirección de origen del viaje
  
    // Nuevos campos para la ruta y la geometría
    ruta?: {
      inicio: {
        lat: number;            // Latitud de la dirección de inicio
        lng: number;            // Longitud de la dirección de inicio
        nombre: string;         // Nombre o descripción de la dirección de inicio
      };
      destino: {
        lat: number;            // Latitud de la dirección de destino
        lng: number;            // Longitud de la dirección de destino
        nombre: string;         // Nombre o descripción de la dirección de destino
      };
      geometria?: any;          // Aquí puedes almacenar el geojson o los datos de la ruta
      distancia?: number;       // Distancia de la ruta (en kilómetros, por ejemplo)
      duracion?: number;        // Duración estimada de la ruta (en minutos, por ejemplo)
    };
  }
  