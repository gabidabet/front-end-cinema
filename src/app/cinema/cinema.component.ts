import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CinemaService } from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes; public currentVille;
  public cinemas; public currentCinema;
  public salles;
  public projections;
  public seances;
  public tickets; public currentSeance;
  public selectedTickets;

  constructor(private cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, error => {
        console.log(error);
      });
  }

  onGetCinemas(ville) {
    this.currentVille = ville;
    this.cinemaService.getCinemas(ville)
      .subscribe(data => {
        this.cinemas = data;
      }, error => {
        console.log(error);
      });
  }

  onGetSalles(cinema) {
    this.currentCinema = cinema;
    this.cinemaService.getSalles(cinema)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, error => {
              console.log(error);
            });
        });
      }, error => {
        console.log(error);
      });
  }

  onGetTickets(p) {
    this.currentSeance = p;
    this.cinemaService.getTickets(p)
      .subscribe(data => {
        this.currentSeance.tickets = data;
        this.selectedTickets = [];
      }, error => console.log(error));
  }

  onSelectTicket(t) {

    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    }
    else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }

    console.log(this.selectedTickets);

  }

  getTicketStatus(t) {
    let src = "button ";
    if (t.reserve) {
      src += "is-danger";
    }
    else if (t.selected) {
      src += "is-warning";
    }
    else {
      src += "is-success";
    }
    return src;
  }

  onPayTickets(dataForm) {
    console.log(dataForm);
    let tickets = [];
    this.selectedTickets.forEach(t => {
      tickets.push(t.id);
    });
    dataForm.tickets = tickets;
    this.cinemaService.PayerTickets(dataForm)
      .subscribe(data => {
        alert("payement effectué avec success");
        this.onGetTickets(this.currentSeance);
      }, error => console.log(error));

  }
}
