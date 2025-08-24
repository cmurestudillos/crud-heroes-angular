export class HeroeModel {
  id?: string;
  nombre?: string;
  poder?: string;
  estado?: boolean;

  constructor() {
    this.nombre = '';
    this.poder = '';
    this.estado = true;
  }
}
