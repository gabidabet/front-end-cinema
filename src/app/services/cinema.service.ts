import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  constructor(private http:HttpClient) { }


  getVilles() {
    return this.http.get("http://localhost:8080/villes");
  }

  getCinemas(ville) {
    return this.http.get(ville._links.cinemas.href);
  }

  getSalles(cinema) {
    return this.http.get(cinema._links.salles.href.replace("{?projection}",""));
  }

  getProjections(salle) {
    return this.http.get(salle._links.projections.href.replace("{?projection}","?projection=pro1"));
  }

  getSeances(projection) {
    return this.http.get(projection._links.seances.href.replace("{?projection}","?projection=pro3"));
  }

  getTickets(p) {
    return this.http.get(p._links.tickets.href);
  }

  PayerTickets(dataForm) {
    return this.http.post("http://localhost:8080/payerTickets", dataForm);
  }
}
