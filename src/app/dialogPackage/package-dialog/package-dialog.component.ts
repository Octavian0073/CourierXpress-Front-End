import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PackageDialogService } from '../package-dialog.service';
import { Router } from '@angular/router';
import { Shipment, Recipient, Sender } from '../package';
import { forkJoin, switchMap } from 'rxjs';
import { Route } from '../../employee/routes/route';

@Component({
  selector: 'fast-package-dialog',
  templateUrl: './package-dialog.component.html',
  styleUrls: ['./package-dialog.component.css']
})
export class PackageDialogComponent implements OnInit {

  registerForm!: FormGroup;
  shipment!: Shipment;
  sender!: Sender;
  recipient!: Recipient;
  route!: Route;

  postSender$ = this.packageDialogService.postSender(this.sender);
  postRecipient$ = this.packageDialogService.postRecipient(this.recipient);
  getRoutes$ = this.packageDialogService.getRoutes();

  transportTypes: any = [
    { value: 'STANDARD', viewValue: 'STANDARD' },
    { value: 'SPECIAL', viewValue: 'SPECIAL' },
  ];

  constructor(
    public dialogRef: MatDialogRef<PackageDialogComponent>,
    private fb: FormBuilder,
    private packageDialogService: PackageDialogService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      originCityId: [0, { validators: [Validators.required] }],
      originCity: ['', { validators: [Validators.required] }],
      destinationCityId: [0, { validators: [Validators.required] }],
      destinationCity: ['', { validators: [Validators.required] }],
      senderName: ['', { validators: [Validators.required] }],
      senderNumber: ['', { validators: [Validators.required] }],
      recipientName: ['', { validators: [Validators.required] }],
      recipientNumber: ['', { validators: [Validators.required] }],
      packageWeight: [0, { validators: [Validators.required] }],
      transportType: ['', { validators: [Validators.required] }]
    })
    this.registerForm.valueChanges.subscribe((data) => {

      this.recipient = {
        personName: data.recipientName,
        inCity: {
          id: data.destinationCityId,
          cityName: data.destinationCity,
          hasOffice: true
        },
        personPhone: data.recipientNumber,
        role: {
          id: 4,
          roleName: "receiver"
        }
      };
      this.sender = {
        personName: data.senderName,
        inCity: {
          id: data.originCityId,
          cityName: data.originCity,
          hasOffice: true
        },
        personPhone: data.senderNumber,
        role: {
          id: 3,
          roleName: "sender"
        }
      };
      this.route = {
        id: 1,
        fromCity: {
          id: data.originCityId,
          cityName: data.originCity,
          hasOffice: true
        },
        toCity: {
          id: data.destinationCityId,
          cityName: data.destinationCity,
          hasOffice: true
        },
        transportType: "SPECIAL",
        pathId: 0,
        distance: 0
      }

      this.shipment = {
        packageWeight: data.packageWeight,
        sender: this.sender,
        receiver: this.recipient,
        route: this.route,
        currentCity: data.originCityId,
        price: 5,
        packageType: data.transportType,
        packageStatus: "waiting for response",
        returnStarted: false,
        packageReturned: false
      }
    })
  }

  addPackage() {
    forkJoin([
      this.packageDialogService.postSender(this.sender),
      this.packageDialogService.postRecipient(this.recipient),
      this.packageDialogService.getRoutes()
    ]).pipe(
      switchMap((data) => {
        const [senderData, recipientData, routesData] = data;
        this.recipient.id = recipientData.id;
        this.sender.id = senderData.id;
        routesData.map((route) => {
          if (route.fromCity.id === this.shipment.route.fromCity.id &&
            route.toCity.id === this.shipment.route.toCity.id
          ) {
            this.shipment.route.id = route.id!;
            this.shipment.route.pathId = route.pathId!;
            this.shipment.route.distance = route.distance!;
          }

        })
        return this.packageDialogService.postShipment(this.shipment);
      })
    ).subscribe((data) => {
      this.router.navigate(['employee/shipment', data.id]);
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
