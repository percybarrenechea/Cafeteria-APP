import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockFirebaseService: any;
  let mockRouter: any;
  let mockNavController: any;  // Mock para NavController

  beforeEach(waitForAsync(() => {
    mockFirebaseService = {
      loginUsuario: jasmine.createSpy('loginUsuario').and.returnValue(Promise.resolve())
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockNavController = {  // Simulamos el comportamiento de NavController
      navigateForward: jasmine.createSpy('navigateForward')
    };

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: Router, useValue: mockRouter },
        { provide: NavController, useValue: mockNavController }, // Inyectar NavController simulado
        UtilsService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('iniciar sesión como usuario y navegar a la página principal si inicia sesión correctamente', async () => {
    // Preparar:
    component.email = 'test@test.com';
    component.password = 'password123';

    // Actuar:
    await component.onLogin();

    // Afirmar:
    expect(mockFirebaseService.loginUsuario).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/main/home']);
  });

  it('mostrar un mensaje de error cuando falla el inicio de sesión', async () => {
    // Preparar:
    mockFirebaseService.loginUsuario.and.returnValue(Promise.reject('Login failed'));
    component.email = 'wrong@test.com';
    component.password = 'wrongpassword';

    // Actuar:
    await component.onLogin();

    // Afirmar:
    expect(mockFirebaseService.loginUsuario).toHaveBeenCalledWith('wrong@test.com', 'wrongpassword');
    expect(component.errorMessage).toBe('Correo o contraseña incorrectos');
  });

  it('navegar a la página de registro cuando se hace clic en "Registrar usuario"', () => {
    // Preparar:
    // ...
    
    // Actuar:
    component.goToSignUp();

    // Afirmar:
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sign-up']);
  });
});
