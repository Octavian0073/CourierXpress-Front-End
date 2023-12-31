import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment, Status } from 'src/app/shared/models/package';

@Injectable({
  providedIn: 'root'
})
export class ShipmentDetailsService {

  constructor(private http: HttpClient) { }

  getShipment(id: number) {
    return this.http.get<Shipment>(`/api/shipments/${id}`);
  }

  setInTransit(id: number, status: Status) {
    return this.http.put<Shipment>(`/api/shipments/${id}`, status);
  }

  calculatePrice(d: number, w: number, type: string) {
    const cost = (d * 0.10) + (w * 5) + (type === "STANDARD" ? 0 : 10);
    return cost;
  }
}
