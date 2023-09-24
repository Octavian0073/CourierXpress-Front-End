import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment } from '../dialogPackage/package';
import { Path } from '../employee/routes/route';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient) { }

  getShipment(id: number) {
    return this.http.get<Shipment>(`/api/shipments/${id}`);
  }

  getPath(id: number) {
    return this.http.get<Path>(`/api/paths/${id}`);
  }

  updateCity(shipmentCode: number, updateCityId: number) {
    return this.http.put<Shipment>(`/api/shipments/${shipmentCode}`, { currentCity: updateCityId });
  }
}