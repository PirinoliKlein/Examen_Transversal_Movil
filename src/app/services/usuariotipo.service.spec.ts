import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './firebas/usuarios.service.spec';
import { UserService } from './usuariotipo.service'; 

describe('UserService', () => {
  let service: UserService;
  let firestore: jasmine.SpyObj<AngularFirestore>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    firestore = jasmine.createSpyObj('AngularFirestore', ['collection']);
    authService = jasmine.createSpyObj('AuthService', ['isLogged']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFirestore, useValue: firestore },
        { provide: AuthService, useValue: authService }
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});