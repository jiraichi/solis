import { Component, ElementRef, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { Months } from '../../interfaces/angle';
import { ActivatedRoute } from '@angular/router';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { NavController } from '@ionic/angular';
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

  dunkinDonutsChartOptions = {
    responsive: true
  };
  dunkinDonutsChartLabels = [];
  dunkinDonutsChartData: {
    data: any[];
    label: string;
  }[] = [];


  currentSegment = 'statistics';
  skyDataOptions = { year: '2019-2020', time: 'monthly' };
  irradianceYear = '2019-2020';
  lat: string;
  long: string;

  angles$: Observable<Months>;
  orientation: DeviceOrientationCompassHeading;

  disableInteractiveButton = true;


  angleXAverage: number;
  angleYAverage: number;


  skyCondition$: Observable<any>;
  solarIrradiance$: Observable<any>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private deviceOrientation: DeviceOrientation,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.lat = params.get('coordinates').split('_')[0];
      this.long = params.get('coordinates').split('_')[1];
    });

    this.onChangeTime();
    this.solarIrradiance();
    this.getAngles();



    this.angles$.subscribe(res => {

    });


  }

  goToInteractiveMode() {
    this.navCtrl.navigateForward(`/location-details/${this.lat}-${this.long}/angle/${this.lat}_${this.long}/${this.angleXAverage}_${this.angleYAverage}`);
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
    const start = this.irradianceYear.split('-')[0];
    const end = this.irradianceYear.split('-')[1];
    if (this.lat && this.long) {
      this.solarIrradiance$ = this.api.getSolarIrradience(this.lat, this.long, start, end).pipe(
        tap(irradiance => {
          const vertical = [];
          const horizontal = [];
          this.lineChartLabels = [];
          this.lineChartData = [];
          for (const key in irradiance) {
            if (key && key !== 'ANN') {
              this.lineChartLabels.push(key);
              vertical.push(irradiance[key].vertical);
              horizontal.push(irradiance[key].horizontal);
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

getAngles() {
  this.angles$ = this.api.getAngles(this.lat, this.long).pipe(
    tap(res => {
      /*
      * Calculates the average angle that is passed to 3d model view
      * x is an average of horizontal angles from 12 months
      * y is an average of horizontal angles from 12 months
      */
      let x = 0;
      let y = 0;
      const vertical = [];
      const horizontal = [];

      Object.entries(res).forEach(([key, val]) => {
        if (key !== 'ANN') {
          x += val.horizontal / 12;
          y += val.vertical / 12;
          if (!this.dunkinDonutsChartLabels.includes(key)) {
            this.dunkinDonutsChartLabels.push(key);
          }
          vertical.push(val.vertical);
          horizontal.push(val.horizontal);
          this.dunkinDonutsChartData = [
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
      });

      this.angleXAverage = Math.round(x / 18);
      this.angleYAverage = Math.round(y / 18);

      if (this.angleXAverage && this.angleYAverage) {
        this.disableInteractiveButton = false;
      }


      // CHART STUFF


    })
  );
}

}
