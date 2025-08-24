import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private url = 'https://crud-heroes-service.vercel.app/api';

  constructor(private http: HttpClient) {}

  crearHeroe(heroe: HeroeModel): Observable<HeroeModel> {
    return this.http.post<any>(`${this.url}/heroes`, heroe).pipe(
      map((resp: any) => {
        // El backend devuelve el héroe creado con _id
        const nuevoHeroe = { ...resp };
        nuevoHeroe.id = resp._id; // Convertimos _id a id para mantener consistencia
        return nuevoHeroe;
      })
    );
  }

  actualizarHeroe(heroe: HeroeModel): Observable<any> {
    // Usamos _id para la actualización pero enviamos el objeto sin _id
    const heroeTemp = { ...heroe };
    delete heroeTemp.id; // Eliminamos id del objeto a enviar

    return this.http.put(`${this.url}/heroes/${heroe.id}`, heroeTemp);
  }

  borrarHeroe(id: string): Observable<any> {
    return this.http.delete(`${this.url}/heroes/${id}`);
  }

  getHeroeById(id: string): Observable<HeroeModel> {
    return this.http.get<any>(`${this.url}/heroes/${id}`).pipe(
      map((resp: any) => {
        // Convertimos _id a id
        const heroe = { ...resp };
        heroe.id = resp._id;
        return heroe;
      })
    );
  }

  getHeroes(): Observable<HeroeModel[]> {
    return this.http.get<any>(`${this.url}/heroes`).pipe(
      map((resp: any) => {
        // El backend devuelve { "heroes": [...] }
        if (resp && resp.heroes) {
          return resp.heroes.map((heroe: any) => {
            // Convertimos _id a id para mantener consistencia en el frontend
            const heroeModificado = { ...heroe };
            heroeModificado.id = heroe._id;
            delete heroeModificado._id;
            delete heroeModificado.__v; // Eliminamos el campo de versión de Mongoose
            return heroeModificado;
          });
        }
        return [];
      }),
      delay(500)
    );
  }
}
