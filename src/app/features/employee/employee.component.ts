import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PackageDialogComponent } from './components/package-dialog/package-dialog.component';
import { DialogShipmentComponent } from './components/dialog-shipment/dialog-shipment.component';

@Component({
  selector: 'fast-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(
    private route: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  seeRoutes() {
    this.route.navigate(['employee/routes']);
  }

  openPackageForm(): void {
    this.dialog.open(PackageDialogComponent, { width: '450px', height: '550px' });
  }

  updateShipments(): void {
    this.dialog.open(DialogShipmentComponent, { width:'300px', height: '300px' });
  }
}
