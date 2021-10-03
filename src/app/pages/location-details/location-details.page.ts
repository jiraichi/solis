import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { Months } from '../../interfaces/angle';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';


@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
})
export class LocationDetailsPage implements OnInit {

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels = [];
  barChartData: {
    data: any[];
    label: string;
  }[] = [];

  lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  lineChartLabels = [];
  lineChartData: {
    data: any[];
    label: string;
  }[] = [];


  currentSegment = 'statistics';
  skyDataOptions = { year: '2019-2020', time: 'monthly' };
  irradienceYear = '2019-2020';
  lat: string;
  long: string;

  angles$: Observable<Months>;
  skyCondition$: Observable<any>;
  solarIrradiance$: Observable<any>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.lat = params.get('coordinates').split('-')[0];
      this.long = params.get('coordinates').split('-')[1];
    });

    this.angles$ = this.api.getAngles(this.lat, this.long);
    this.onChangeTime();
    this.solarIrradiance();
  }

  skyConditions(start: string, end: string, time: string) {
    this.skyCondition$ = this.api.getSkyConditions(this.lat, this.long, start, end, time).pipe(
      tap(sky => {
        const clearSky = [];
        const cloudAmount = [];
        this.barChartLabels = [];
        for (const key in sky) {
          if (key) {
            this.barChartData = [];
            this.barChartLabels.push(key);
            clearSky.push(sky[key].clear_sky);
            cloudAmount.push(sky[key].cloud_amount);
            this.barChartData = [
              {
                data: clearSky,
                label: 'Clear Sky'
              },
              {
                data: cloudAmount,
                label: 'Cloud Amount'
              }
            ];
          }
        }
      }));
  }

  onChangeTime() {
    const start = this.skyDataOptions.year.split('-')[0];
    const end = this.skyDataOptions.year.split('-')[1];
    const time = this.skyDataOptions.time;
    this.skyConditions(start, end, time);
  }

  solarIrradiance() {
    const start = this.irradienceYear.split('-')[0];
    const end = this.irradienceYear.split('-')[1];
    if (this.lat && this.long) {
      this.solarIrradiance$ = this.api.getSolarIrradience(this.lat, this.long, start, end).pipe(
        tap(irradience => {
          const vertical = [];
          const horizontal = [];
          this.lineChartLabels = [];
          this.lineChartData = [];
          for (const key in irradience) {
            if (key && key !== 'ANN') {
              this.lineChartLabels.push(key);
              vertical.push(irradience[key].vertical);
              horizontal.push(irradience[key].horizontal);
              this.lineChartData = [
                {
                  data: vertical,
                  label: 'Vertical'
                },
                {
                  data: horizontal,
                  label: 'Horizontal'
                }
              ];
            }
          }
        })
      );

    }
  }


  segmentChanged(event) {
    console.log('segment changed ', event);
  }
}
