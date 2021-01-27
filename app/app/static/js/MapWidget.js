function Point(lat, lon, street) {
    this.lat = lat;
    this.lon = lon;
    this.street = street;
}

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
    const polyLineStyle = {color: polyLineColor, weight: 2, opacity: 0.5};
    const latLngMargin = 0.00001;

    this.app = app;
    this.osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'opacity': 0.7,
        'attribution': [attrOsm, attrOverpass].join(', ')
    });
    this.map = new L.Map('map',).addLayer(this.osm).setView(initPos, initZoom);
    this.opl = new L.OverPassLayer({'query': query, onSuccess: data => this.setupOverPassLayer(data)});
    this.map.addLayer(this.opl);
    this.circles = new Set();
    this.circle = null;
    this.polyline = null;
    this.circlePairsToPolylines = {};
    this.polylinesToCirclePairs = {};
    this.circleToId = {};

    this.setupOverPassLayer = function (data) {
        for (let i = 0; i < data.elements.length; i++) {
            let circle = new L.circle([data.elements[i].lat, data.elements[i].lon], {
                color: pointBorderColor,
                fillColor: pointFillColor,
                fillOpacity: 0.5,
                radius: pointRadius
            }).addTo(this.map);
            circle.on('click', (circle) => this.onCircleClicked(circle));
        }
    };
    this.copyPolyLine = (polyline) => {
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
            }
            else if(!this.isPolylineExists(this.circle, circle)) {
                this.polyline.setLatLngs([this.polyline.getLatLngs()[0], pos]);

                let polylineCopy = this.copyPolyLine(this.polyline);
                let key = this.makeKeyFromCirclePair(this.circle, circle);

                this.circlePairsToPolylines[key] = polylineCopy;
                polylineCopy.addTo(this.map);
                polylineCopy.on('click', e => this.onPolyLineClick(e));
                this.map.fitBounds(polylineCopy.getBounds());

                this.polyline = null;
                this.circle = null;
            }
        }
        this.circles.add(circle);
    }
    this.map.on('mousemove', e => {
        if (this.polyline) {
            let lat = e.latlng.lat - latLngMargin;
            let lng = e.latlng.lng - latLngMargin;
            this.polyline.setLatLngs([this.polyline.getLatLngs()[0], new L.LatLng(lat, lng)]);
        }
    });
    this.makeKeyFromCirclePair = (circle1, circle2) => {
        let latLng1 = circle1.getBounds().getCenter();
        let latLng2 = circle2.getBounds().getCenter();
        return JSON.stringify([latLng1, latLng2]);
    };
    this.onPolyLineClick = (polyline) => {

    };
    this.isPolylineExists = (circle1, circle2) => {
        let key1 = this.makeKeyFromCirclePair(circle1, circle2);
        let key2 = this.makeKeyFromCirclePair(circle2, circle1);

        for(let key in this.circlePairsToPolylines) {
            if (key === key2 || key === key1) {
                return true;
            }
        }
        return false;
    };
    this.getPlan = () => {

    };
}
