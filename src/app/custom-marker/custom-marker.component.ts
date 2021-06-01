import { FitBoundsAccessor, FitBoundsDetails } from '@agm/core';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-custom-marker',
  templateUrl: './custom-marker.component.html',
  styleUrls: ['./custom-marker.component.css'],
  providers: [{ provide: FitBoundsAccessor, useExisting: forwardRef(() => CustomMarkerComponent) }]
})
export class CustomMarkerComponent implements OnInit, FitBoundsAccessor {

  @Input() latitude: number;
  @Input() longitude: number;

  fitBoundDetails$ = new BehaviorSubject<FitBoundsDetails>(null);

  getFitBoundsDetails$(): Observable<FitBoundsDetails> {
    return this.fitBoundDetails$.asObservable();
  }

  constructor() {
  }

  ngOnInit(): void {
    const latLng: google.maps.LatLngLiteral = { lat: this.latitude, lng: this.longitude };
    this.fitBoundDetails$.next({ latLng });
  }

}
