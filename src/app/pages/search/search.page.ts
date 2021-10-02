import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';

type Place = {
  placeName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchTerm: string;
  addresses: Place[];

  userLocation: {
    lat: number;
    lng: number;
  };

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  search() {
    if (this.searchTerm && this.searchTerm.length > 0) {
      this.mapPlaces().subscribe();
    } else {
      this.addresses = [];
    }
  }


  mapPlaces() {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(`${url} ${this.searchTerm}.json?access_token=${environment.mapbox.accessToken}`)
      .pipe(map((res: any) => {
        this.addresses = res.features.map(feat => (
          { placeName: feat.place_name, coordinates: { lat: feat.geometry.coordinates[1], lng: feat.geometry.coordinates[0] } }));
      }), catchError(async (error) => console.log(error)));
  }


  onSelectPlace(selectedPlace: Place) {
    this.navCtrl.navigateForward(`/location-details/${selectedPlace.coordinates.lat}-${selectedPlace.coordinates.lng}`);
  }

  onFindNearbyLocations() {
    if (this.userLocation) {
      this.navCtrl.navigateForward(`/location-details/${this.userLocation.lat}-${this.userLocation.lng}`);
    }
  }

}
