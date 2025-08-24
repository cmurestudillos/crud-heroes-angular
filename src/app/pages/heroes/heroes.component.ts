import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: HeroeModel[] = [];
  cargando = false;
  year = new Date().getFullYear();

  constructor(private heroesService: HeroesService) {}

  ngOnInit() {
    this.cargarHeroes();
  }

  cargarHeroes() {
    this.cargando = true;
    this.heroesService.getHeroes().subscribe({
      next: resp => {
        this.heroes = resp;
        this.cargando = false;
      },
      error: error => {
        console.error('Error al cargar heroes:', error);
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los héroes',
          icon: 'error',
        });
      },
    });
  }

  borrarHeroe(heroe: HeroeModel, ind: number) {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el registro?',
      text: `Va a borrar a ${heroe.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(resp => {
      if (resp.value) {
        this.heroesService.borrarHeroe(heroe.id!).subscribe({
          next: response => {
            this.heroes.splice(ind, 1);
            Swal.fire({
              title: 'Eliminado',
              text: `${heroe.nombre} ha sido eliminado correctamente`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: error => {
            console.error('Error al eliminar héroe:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el héroe',
              icon: 'error',
            });
          },
        });
      }
    });
  }
}
