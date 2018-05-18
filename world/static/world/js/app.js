// 地理院地図　標準地図
var std = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    {id: 'stdmap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"})

// 地理院地図　淡色地図
var pale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    {id: 'palemap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"})

// 地理院地図　白地図
var blank = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
    {id: 'blankmap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"});

// 地理院地図　写真
var photo = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    {id: 'photomap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"});

// 地理院地図　写真
var photo = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    {id: 'photomap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"});

// 地理院地図　English
var english = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png',
    {id: 'englishmap', attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>"});

// 地理院地図　オルソ
var ort = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});

//--------- OSM ------------
// OSM Japan
var osmjp = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
    { id: 'osmmapjp', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// OSM本家
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { id: 'osmmap', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// OpenCycleMap
var opencycle = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    { id: 'opencycle', attribution: '&copy; OpenCycleMap and <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// Watercolor
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
    { id: 'watercolor', attribution: '&copy; Map tiles by Stamen Design, under CC BY 3.0. Data by <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// Toner
var toner = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
    { id: 'toner', attribution: '&copy; Map tiles by Stamen Design, under CC BY 3.0. Data by  <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// Outdoor
var outdoor = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
    { id: 'outdoor', attribution: 'Tiles &copy; Gravitystorm / map data <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// Transport
var transport = L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png',
    { id: 'transport', attribution: 'Tiles &copy; Gravitystorm / map data <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

// landscape
var landscape = L.tileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png',
    { id: 'landscape', attribution: 'Tiles &copy; Gravitystorm / map data <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' });

/*
var g_roadmap = new L.Google('ROADMAP');
var g_satellite = new L.Google('SATELLITE');
var g_hybrid = new L.Google('HYBRID');
*/

var baseMaps = {
    "地理院地図 標準地図" : std,
    "地理院地図 淡色地図" : pale,
    "地理院地図 白地図"   : blank,
    "地理院地図 写真"   : photo,
    "地理院地図 English"   : english,
    "地理院地図 オルソ"   : ort,

    "OSM本家"  : osm,
    "OSM japan" : osmjp,
    /*
    "GoogleMap 標準": g_roadmap,
    "GoogleMap オルソ": g_satellite,
    "GoogleMap ハイブリッド": g_hybrid,
    */

    "OpenCycleMap" : opencycle,

    "Watercolor" : watercolor,
    "Toner" : toner,

    "Outdoor" : outdoor,
    "Transport" : transport,
    "Landscape" : landscape
};
    
var map = L.map('map', {layers: [std]});
map.setView([35.5774, 139.6544], 13);

// コントロールはオープンにする
L.control.layers(baseMaps, null, {collapsed:false}).addTo(map);

//スケールコントロールを追加（オプションはフィート単位を非表示）
L.control.scale({imperial: false}).addTo(map);

/* クリックしたい緯度経度を表示 */
map.on('click', function(e) {
    var latitude  = (Math.round(e.latlng.lat * 10000)) /10000;
    var longitude = (Math.round(e.latlng.lng * 10000)) /10000;
    console.log("緯度(latitude):" + latitude + " , " + "経度(longitude):" + longitude);
});

/* GeoJSONレイヤーを追加します */
$.getJSON("/world/geojson/", function(data) {
    L.geoJson(data).addTo(map);
});

