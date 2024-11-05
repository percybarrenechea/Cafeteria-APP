import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpPage } from './sign-up.page';
import { SignUpPageRoutingModule } from './sign-up-routing.module'; // Asegúrate de tener un archivo de enrutamiento

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpPageRoutingModule // Asegúrate de importar el módulo de enrutamiento
  ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}

