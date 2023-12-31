import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { Person } from '../models/persons';
import { Shipment } from '../models/package';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  isEmployee: boolean = false;
  isCustomer: boolean = false;
  customerId!: number;
  isDriver: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  employeeRegistration(id: number) {
    return this.http.get<Person>(`/api/persons/${id}`).pipe(
      map((data) => {
        this.isEmployee = data.role.roleName === 'employee';
        return this.isEmployee;
      }))
  }

  customerRegistration(shipmentId: number, id: number): any {
    return this.http.get<Shipment>(`/api/shipments/${shipmentId}`).pipe(
      map((data) => {
        this.isCustomer = id === data.sender.id;
        return this.isCustomer;
      }))
  }

  driverRegistration(id: number) {
    return this.http.get<Person>(`/api/persons/${id}`).pipe(
      map((data) => {
        this.isDriver = data.role.roleName === 'driver';
        return this.isDriver;
      }))
  }
}
