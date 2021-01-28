const mapAliases = [
    'улица',
    'аллея',
    'бульвар',
    'линия',
    'взвоз',
    'набережная',
    'тракт',
    'тупик',
    'шоссе',
    'переулок',
    'проспект'
];

export default function MapWidget(app) {
    const attrOsm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
    const attrOverpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';
    const initPos = new L.LatLng(59.9639605, 30.2950407);
    const initZoom = 22;
    const query = '(way[highway=motorway]({{bbox}});' +
        'way[highway=trunk]({{bbox}});' +
        'way[highway=primary]({{bbox}});' +
        'way[highway=secondary]({{bbox}});' +
        'way[highway=tertiary]({{bbox}});' +
        'way[highway=residential]({{bbox}}););' +
        '>;out qt;';
    const pointRadius = 4;
    const pointBorderColor = "red";
    const pointFillColor = "green";
    const polyLineColor = "green";
    const polyLineStyle = {color: polyLineColor, weight: 3, opacity: 0.8};
    const latLngMargin = 0.00001;

    this.app = app;
    this.osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'opacity': 0.7,
        'attribution': [attrOsm, attrOverpass].join(', ')
    });
    this.map = new L.Map('map',).addLayer(this.osm).setView(initPos, initZoom);
    this.opl = new L.OverPassLayer({
        'query': query, onSuccess: data => {
            this.setupOverPassLayer(data);
            this.app.onMapWidgetIsReady();
        }
    });
    this.map.addLayer(this.opl);
    this.relations = [];
    this.polylines = [];
    this.polyline = null;
    this.mapWidgetEnabled = false;
    this.setWidgetEnabled = enabled => this.mapWidgetEnabled = enabled;
    this.setupOverPassLayer = function (data) {
        for (let i = 0; i < data.elements.length; i++) {
            let circle = new L.circle([data.elements[i].lat, data.elements[i].lon], {
                color: pointBorderColor,
                fillColor: pointFillColor,
                fillOpacity: 0.5,
                radius: pointRadius
            }).addTo(this.map);
            circle.on('click', circle => this.onCircleClicked(circle));
        }
    };
    this.copyPolyLine = polyline => {
        return new L.Polyline(polyline.getLatLngs(), polyLineStyle);
    };
    this.onCircleClicked = (e) => {
        if (this.mapWidgetEnabled) {
            let circle = e.target;
            let pos = circle.getBounds().getCenter();

            if (!this.polyline) {
                this.polyline = new L.Polyline([pos, pos], polyLineStyle).addTo(this.map);
                this.map.fitBounds(this.polyline.getBounds());
                return;
            }

            let beginPos = this.polyline.getLatLngs()[0];

            if (pos !== beginPos && !this.isPolylineExists(beginPos, pos)) {
                this.polyline.setLatLngs([beginPos, pos]);

                let polylineCopy = this.copyPolyLine(this.polyline);

                polylineCopy.addTo(this.map);
                polylineCopy.on('click', e => this.onPolyLineClick(e));
                this.map.fitBounds(polylineCopy.getBounds());

                this.relations.push(polylineCopy.getLatLngs());
                this.polylines.push(polylineCopy);

                this.polyline.removeFrom(this.map);
                this.polyline = null;
            }
        }
    }
    this.map.on('mousemove', e => {
        if (this.mapWidgetEnabled && this.polyline) {
            let lat = e.latlng.lat;
            let lng = e.latlng.lng;

            let center = this.polyline.getLatLngs()[0];

            if (center.lat < lat) {
                lat -= latLngMargin;
            } else {
                lat += latLngMargin;
            }

            if (center.lng < lng) {
                lng -= latLngMargin;
            } else {
                lng += latLngMargin;
            }

            this.polyline.setLatLngs([this.polyline.getLatLngs()[0], new L.LatLng(lat, lng)]);
        }
    });
    this.onPolyLineClick = e => {
        if (this.mapWidgetEnabled) {
            let polyline = e.target;
            this.polylines.remove(polyline);
            polyline.removeFrom(this.map);
            let index = this.relations.indexOf(polyline.getLatLngs());
            if (index >= 0) {
                this.relations.splice(index, 1);
            }
        }
    };
    this.isPolylineExists = (pos1, pos2) => {
        let key1 = JSON.stringify([pos1, pos2]);
        let key2 = JSON.stringify([pos2, pos1]);
        for (let i = 0; i < this.relations.length; ++i) {
            let key = JSON.stringify(this.relations[i]);
            if (key === key1 || key === key2) {
                return true;
            }
        }
        return false;
    };
    this.getPlan = () => {
        return {plan: {relations: this.relations}};
    };
    this.clearMap = () => {
        this.relations.length = 0;
        this.polyline = null;
        this.polylines.forEach(e => e.removeFrom(this.map));
        this.polylines.length = 0;
    };
    this.setPlan = (plan) => {
        this.clearMap();
        this.relations = plan.relations;
        for(let i = 0; i < this.relations.length; ++i) {
            let polyline = new L.Polyline(this.relations[i], polyLineStyle).addTo(this.map);
            this.map.fitBounds(polyline.getBounds());
        }
    }
}
