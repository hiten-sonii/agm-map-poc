import { AgmCoreModule, FitBoundsAccessor, GoogleMapsAPIWrapper } from '@agm/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AgmOverlays } from 'agm-overlays';
import { CustomMarkerComponent } from './custom-marker/custom-marker.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmDirectionModule } from 'agm-direction';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CustomMarkerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDf8AjYW1CxfkedsLLZNfaYRJfZYCTSj08',
      libraries: ['places'],
    }),
    AgmOverlays,
    AgmJsMarkerClustererModule,
    AgmDirectionModule

  ],
  providers: [GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
