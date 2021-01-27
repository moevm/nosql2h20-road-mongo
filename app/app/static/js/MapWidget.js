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
    const pointRadius = 3;
    const pointBorderColor = "red";
    const pointFillColor = "green";
    const polyLineColor = "green";
    const polyLineStyle = {color: polyLineColor, weight: 4, opacity: 0.5};
    const latLngMargin = 0.00001;

    this.app = app;
    this.osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'opacity': 0.7,
        'attribution': [attrOsm, attrOverpass].join(', ')
    });
    this.map = new L.Map('map',).addLayer(this.osm).setView(initPos, initZoom);
    this.opl = new L.OverPassLayer({'query': query, onSuccess: data => this.setupOverPassLayer(data)});
    this.map.addLayer(this.opl);
    this.points = new Set();
    this.relations = [];
    this.circle = null;
    this.polyline = null;
    this.pointPairHashToPolyline = {};
    this.polylineHashToPointPairHash = {};

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
        let circle = e.target;

        if (this.circle !== circle) {
            let pos = circle.getBounds().getCenter();

            if (!this.polyline) {
                this.circle = circle;
                this.polyline = new L.Polyline([pos, pos], polyLineStyle).addTo(this.map);
                this.map.fitBounds(this.polyline.getBounds());
                this.points.add(circle.getBounds.getCenter());
            }
            else if(!this.isPolylineExists(this.circle, circle)) {
                this.points.add(circle.getBounds.getCenter());

                this.polyline.setLatLngs([this.polyline.getLatLngs()[0], pos]);

                let polylineCopy = this.copyPolyLine(this.polyline);
                let pointPairHash = this.makeHashFromCirclePair(this.circle, circle);
                let polyLineHash = this.makeHashFromPolyline(polylineCopy);

                this.pointPairHashToPolyline[pointPairHash] = polyLineHash;
                this.polylineHashToPointPairHash[polyLineHash] = pointPairHash;

                polylineCopy.addTo(this.map);
                polylineCopy.on('click', e => this.onPolyLineClick(e));
                this.map.fitBounds(polylineCopy.getBounds());

                this.relations.push(polylineCopy.getLanLngs());

                this.polyline.removeFrom(this.map);
                this.polyline = null;
                this.circle = null;
            }
        }
    }
    this.map.on('mousemove', e => {
        if (this.polyline) {
            let lat = e.latlng.lat;
            let lng = e.latlng.lng;

            let center = this.circle.getBounds().getCenter();

            if (center.lat < lat) {
                lat -= latLngMargin;
            }
            else {
                lat += latLngMargin;
            }

            if (center.lng < lng) {
                lng -= latLngMargin;
            }
            else {
                lng += latLngMargin;
            }

            this.polyline.setLatLngs([this.polyline.getLatLngs()[0], new L.LatLng(lat, lng)]);
        }
    });
    this.makeHashFromCirclePair = (circle1, circle2) => {
        let latLng1s = circle1.getBounds().getCenter();
        let latLng2s = circle2.getBounds().getCenter();

        return JSON.stringify([latLng1s, latLng2s]);
    };
    this.makeHashFromPolyline = polyline => {
        return JSON.stringify(polyline.getLatLngs());
    }
    this.onPolyLineClick = e => {
        let polyline = e.target;
        let polylineHash = this.makeHashFromPolyline(polyline);
        let pointPairHash = this.polylineHashToPointPairHash[polylineHash];

        let points = JSON.parse(pointPairHash);
        this.points.delete(points[0]);
        this.points.delete(points[1]);

        delete this.pointPairHashToPolyline[pointPairHash]
        delete this.polylineHashToPointPairHash[polylineHash];

        polyline.removeFrom(this.map);

        let index = this.relations.indexOf(polyline.getLanLngs());
        if (index >= 0) {
            arr.splice(index, 1);
        }
    };
    this.isPolylineExists = (circle1, circle2) => {
        let key1 = this.makeHashFromCirclePair(circle1, circle2);
        let key2 = this.makeHashFromCirclePair(circle2, circle1);

        for(let key in this.pointPairHashToPolyline) {
            if (key === key2 || key === key1) {
                return true;
            }
        }
        return false;
    };
    this.getPlan = () => {
        return {"points": Array.from(this.points), "relations": this.relations};
    };
    this.clearMap = () => {
        this.relations.length = 0;
        this.points.clear();
        this.polyline = null;
        this.circle = null;
        this.polylineHashToPointPairHash.clear();
        this.pointPairHashToPolyline.clear();
    }
}
