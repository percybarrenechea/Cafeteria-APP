import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpPage } from './sign-up.page';
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;
  let firebaseServiceSpy: jasmine.SpyObj<FirebaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const firebaseServiceMock = jasmine.createSpyObj('FirebaseService', ['registrarUsuario']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ SignUpPage ],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;
    firebaseServiceSpy = TestBed.inject(FirebaseService) as jasmine.SpyObj<FirebaseService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('llamar al registradorUsuario en FirebaseService cuando se llama al registrar', async () => {
    // Preparar:
    firebaseServiceSpy.registrarUsuario.and.returnValue(Promise.resolve());

    component.email = 'test@example.com';
    component.password = '123456';
    component.nombre = 'Test User';

    const event = new Event('submit');

    // Actuar:
    await component.registrar(event);

    // Afirmar:
    expect(firebaseServiceSpy.registrarUsuario).toHaveBeenCalledWith('test@example.com', '123456', 'Test User');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.nombre).toBe('');
  });

});
