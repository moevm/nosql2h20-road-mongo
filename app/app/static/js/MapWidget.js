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
    const pointRadius = 2;
    const pointBorderColor = "red";
    const pointFillColor = "green";

    this.app = app;
    this.osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'opacity': 0.7,
        'attribution': [attrOsm, attrOverpass].join(', ')
    });
    this.map = new L.Map('map').addLayer(this.osm).setView(initPos, initZoom);
    this.opl = new L.OverPassLayer({'query': query, onSuccess: data => this.setupOverPassLayer(data)});
    this.map.addLayer(this.opl);
    this.circlesToPoints = {};
    this.relationsToPolylines = [];
    this.curPolyline = null;
    this.setupOverPassLayer = function (data) {
        for (let i = 0; i < data.elements.length; i++) {
            // if (data.elements[i].hasOwnProperty("tags") && data.elements[i].tags.hasOwnProperty("highway")) {
            let circle = new L.circle([data.elements[i].lat, data.elements[i].lon], {
                color: pointBorderColor,
                fillColor: pointFillColor,
                fillOpacity: 0.5,
                radius: pointRadius
            }).addTo(this.map);
            circle.on('click', (circle) => this.onCircleClicked(circle));
            // this.circlesToPoints[circle] = data.elements[i];

            // }
        }
    }
    this.onCircleClicked = (circle) => {
        let pos = circle.latlng;
        this.curPolyline = new L.Polyline([pos, pos], {
                color: 'green',
                weight: 5,
                opacity: 0.5
            }).addTo(this.map);
            this.map.fitBounds(this.curPolyline.getBounds());
    }
    this.map.on('mousemove', e => {
        if (this.curPolyline) {
            let [begin, _] = this.curPolyline.getLatLngs();
            this.curPolyline.setLatLngs([begin, e.latlng]);
            console.log(e.latlng);
        }
    });
}
