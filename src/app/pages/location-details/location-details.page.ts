import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
})
export class LocationDetailsPage implements OnInit {

  currentSegment = 'statistics';

  constructor() { }

  ngOnInit() {
  }

  segmentChanged(event) {
    console.log('segment changed ', event);
  }

}
