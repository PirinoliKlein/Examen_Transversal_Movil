import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RandomUserService } from './random-user.service';

describe('RandomUserService', () => {
  let service: RandomUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo de pruebas de HttpClient
    });
    service = TestBed.inject(RandomUserService);
    httpMock = TestBed.inject(HttpTestingController); // Inyecta el controlador de pruebas
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch random users', () => {
    service.obtenerUsuariosAleatorios().subscribe((users) => {
      expect(users).toBeTruthy();
      expect(users.results.length).toBe(5);
    });

    const req = httpMock.expectOne('https://randomuser.me/api/?results=5'); // Verifica que se hizo la solicitud
    expect(req.request.method).toBe('GET'); // Verifica que es un método GET
    req.flush({ results: Array(5).fill({}) }); // Simula la respuesta de la API
  });
});