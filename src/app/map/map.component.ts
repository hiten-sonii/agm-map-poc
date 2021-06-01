import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { homesArray } from './data';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('search') searchInput;

  geocoder: any;
  autocomplete: any;
  placesService: any;
  lastClicked: any;
  showDirections: boolean = false;
  searchResult: any = { lat: 0, lng: 0 };
  origin: any;
  destination1: any;
  destination2: any;
  homesArray: any = homesArray;
  clusterIconPath: string = "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m";

  constructor(private http: HttpClient, private mapsApiLoader: MapsAPILoader, private ngZone: NgZone) {
    this.onMapLoad();
  }

  ngOnInit(): void {
    // this.getLuvedHomesData();
  }

  onMapLoad() {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
      this.autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement);
      this.addListenerToSearchInput();
    });
  }

  ngAfterViewInit() {
    this.setOriginAndDestinationForDirections();
  }

  setOriginAndDestinationForDirections() {
    this.origin = { lat: this.homesArray[0].lat, lng: this.homesArray[0].long };
    this.destination1 = {
      lat: this.homesArray[1].lat, lng: this.homesArray[1].long
    };
    this.destination2 = {
      lat: this.homesArray[2].lat, lng: this.homesArray[2].long
    };
  }

  onMapClicked($event) {
    this.homesArray.push({ lat: $event.coords.lat, long: $event.coords.lng, address: "Clicked Marker", fitBounds: false });
    this.lastClicked = { lat: $event.coords.lat, lng: $event.coords.lng };
    this.findAddressByCoordinates($event.coords.lat, $event.coords.lng);
    document.querySelector('.clickedLatLong').innerHTML = $event.coords.lat + '   ' + $event.coords.lng;
  }

  findAddressByCoordinates(lat, long) {
    document.querySelector('.clickedAddress').innerHTML = "Please wait...";
    this.geocoder.geocode({
      'location': {
        lat: lat,
        lng: long,
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    });
  }

  showNearbySchools() {
    const request = {
      location: this.lastClicked,
      radius: 2000,
      type: ['school'],
    };
    const resultArray = [];
    this.placesService.nearbySearch(request, (results, status) => {
      Array.from(results).forEach(school => {
        resultArray.push({ lat: Number(school['geometry'].location.lat()), long: Number(school['geometry'].location.lng()), fitBounds: false, address: school['name'] });
      });
      this.homesArray = [...this.homesArray, ...resultArray.slice(0, 5)];
    });


  }

  addListenerToSearchInput() {
    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const placeResult = this.autocomplete.getPlace();
        if (!placeResult.geometry) {
          return;
        }
        this.searchResult = { lat: placeResult.geometry.location.lat(), long: placeResult.geometry.location.lng() };
        this.homesArray.push({ ...this.searchResult, address: placeResult.name });
      });
    });
  }

  decomposeAddressComponents(addressArray) {
    const clickedLocation: any = {};
    if (addressArray.length == 0) return false;
    let address = addressArray[0].address_components;

    for (let element of address) {
      if (element.length == 0 && !element['types']) continue;

      if (element['types'].indexOf('street_number') > -1) {
        clickedLocation.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        clickedLocation.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        clickedLocation.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        clickedLocation.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        clickedLocation.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        clickedLocation.address_zip = element['long_name'];
        continue;
      }
    }
    document.querySelector('.clickedAddress').innerHTML = JSON.stringify(clickedLocation);
    this.homesArray[this.homesArray.length - 1].address = clickedLocation.address_level_2;
    console.log(clickedLocation);
  }

  toggleShowDirections() {
    this.showDirections = !this.showDirections;
  }

  onClusterClick() {
    console.log('Cluster clicked');
  }

}
