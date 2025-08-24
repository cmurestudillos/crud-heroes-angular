import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroeModel } from '../../models/heroe.model';
import { NgForm } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
})
export class HeroeComponent implements OnInit {
  heroe = new HeroeModel();
  esNuevo = true;
  _idHeroe: string | null = null;

  constructor(
    private heroesService: HeroesService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._idHeroe = id;

    if (id !== 'nuevo') {
      this.esNuevo = false;
      this.cargarHeroe(id!);
    }
  }

  cargarHeroe(id: string) {
    this.heroesService.getHeroeById(id).subscribe({
      next: (resp: HeroeModel) => {
        this.heroe = resp;
      },
      error: error => {
        console.error('Error al cargar héroe:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el héroe',
          icon: 'error',
        }).then(() => {
          this._router.navigate(['/heroes']);
        });
      },
    });
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario no válido.');
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.heroe.id && !this.esNuevo) {
      // Actualizar héroe existente
      peticion = this.heroesService.actualizarHeroe(this.heroe);
    } else {
      // Crear nuevo héroe
      peticion = this.heroesService.crearHeroe(this.heroe);
    }

    peticion.subscribe({
      next: resp => {
        Swal.fire({
          title: this.heroe.nombre,
          text: this.esNuevo ? 'Se creó correctamente' : 'Se actualizó correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this._router.navigate(['/heroes']);
      },
      error: error => {
        console.error('Error al guardar héroe:', error);
        Swal.fire({
          title: 'Error',
          text: this.esNuevo ? 'No se pudo crear el héroe' : 'No se pudo actualizar el héroe',
          icon: 'error',
        });
      },
    });
  }
}
