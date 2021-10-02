import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {Observable} from 'rxjs';
import {Months} from '../../interfaces/angle';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
})
export class LocationDetailsPage implements OnInit {

  currentSegment = 'statistics';
  angles$: Observable<Months>;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.angles$ = this.api.getAngles('64.2008', '149.4937');
  }

  segmentChanged(event) {
    console.log('segment changed ', event);
  }

}
