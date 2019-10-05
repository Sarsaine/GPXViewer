import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {LocationService} from './services/location';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    private gpxViewerMap: L.Map;
    private position: L.Marker;
    private gpx: L.GPX;
    private STORAGE_KEY = 'GPX_LOADED';

    @ViewChild('fileInput', {static: false}) fileInput: ElementRef<HTMLElement>;

    constructor(private locationService: LocationService) {
    }

    async ngOnInit(): Promise<void> {

        const position = await this.locationService.getCurrentLocation().toPromise();

        this.gpxViewerMap = L.map('gpxviewermap').setView([position.coords.latitude, position.coords.longitude], 15);

        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'MAP'
        }).addTo(this.gpxViewerMap);

        const icon = L.icon({
            iconUrl: 'assets/marker-icon.png',
            iconAnchor: [12.5, 41]
        });

        this.position = L.marker([position.coords.latitude, position.coords.longitude], {icon}).addTo(this.gpxViewerMap);
        const gpx = window.localStorage.getItem(this.STORAGE_KEY);

        if (gpx) {
            while (typeof L.GPX === 'undefined') {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            this.loadGPX(gpx);
        }
    }

    public loadFile() {
        this.fileInput.nativeElement.click();
    }

    public handleFileInput(files: FileList) {
        if (files.length) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const gpx = fileReader.result.toString();
                this.loadGPX(gpx);
                window.localStorage.setItem(this.STORAGE_KEY, gpx);
            };
            fileReader.readAsText(files.item(0));
        }
    }

    private loadGPX(gpx: string) {
        if (this.gpx) {
            this.gpxViewerMap.removeLayer(this.gpx);
        }

        this.gpx = new L.GPX(gpx, {async: true}).addTo(this.gpxViewerMap);
    }
}
