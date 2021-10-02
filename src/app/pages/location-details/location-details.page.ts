import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { Months } from '../../interfaces/angle';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
})
export class LocationDetailsPage implements OnInit {

  currentSegment = 'statistics';
  lat: string;
  long: string;
  angles$: Observable<Months>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.lat = params.get('coordinates').split('-')[0];
      this.long = params.get('coordinates').split('-')[1];
    });

    console.log('coordinates', this.lat, this.long);

    this.angles$ = this.api.getAngles(this.lat, this.long);
    this.angles$.subscribe(res => console.log(res));
  }

  segmentChanged(event) {
    console.log('segment changed ', event);
  }

}
