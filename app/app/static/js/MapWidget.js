export default function MapWidget(app) {
    const attrOsm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
    const attrOverpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';
    const initPos = new L.LatLng(59.9639605, 30.2950407);
    const initZoom = 22;
    const query = '(way[highway=motorway]({{bbox}});way[highway=trunk]({{bbox}});way[highway=primary]({{bbox}});way[highway=secondary]({{bbox}});way[highway=tertiary]({{bbox}});way[highway=residential]({{bbox}}););>;out qt;';
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
    this.points = [];

    this.setupOverPassLayer = function (data) {
        for (let i = 0; i < data.elements.length; i++) {
            if (data.elements[i].hasOwnProperty("tags")) {
                this.points.push(data.elements[i]);
                let circle = new L.circle([data.elements[i].lat, data.elements[i].lon], {
                    color: pointBorderColor,
                    fillColor: pointFillColor,
                    fillOpacity: 0.5,
                    radius: pointRadius
                }).addTo(this.map).on('click', () => alert('detected'));
            }
        }
    }
}