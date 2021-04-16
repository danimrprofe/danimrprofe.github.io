


// Definimos los centros de nuestros mapas

var center_cami_des_correu = ol.proj.fromLonLat([2.5389, 39.6922]);
var center_volta_des_general = ol.proj.fromLonLat([2.5338, 39.6951]);
var center_isla_mallorca = ol.proj.fromLonLat([2.7892, 39.6157]);

// Haremos una view para cada mapa
// Creamos una view, la centramos y le metemos el zoom que queremos

var vistaVoltaGeneral = new ol.View({
    center: center_volta_des_general,
    zoom: 15
});

var vistaMallorca = new ol.View({
    center: center_isla_mallorca,
    zoom: 10
});

// Nuestra capa base será un mapa OSM del mapamundi

var capa_base = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Creamos nuestro mapa de excursion y le metemos la capa del mapamundi
// Este mapa va a caer en el DIV con class capa_base

var mapaCorreu = new ol.Map({
    target: 'map',
    layers: [capa_base],
    view: vistaVoltaGeneral,
    loadTilesWhileAnimating: true
});

var mapaMallorca = new ol.Map({
    target: 'mapaMallorca',
    layers: [capa_base],
    view: vistaMallorca
});










// Esto es el icono que quería poner como marcador. La cosa es que da problemas
// Al hacer zoom in y out se va donde le da la gana. Lo he cambiado por un círculo. No se llega a usar

var imagen_refugio = new ol.style.Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 0.95,
    src: 'img/home.png'
});

var image_mountain = new ol.style.Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 0.95,
    src: 'img/mountains.png'
});

var icono_refugio = new ol.style.Style({
    image: imagen_refugio,
    stroke: trazo,
    fill: relleno
});

// Vamos a hacer un circulito con relleno negro y borde blanco
// Creamos las propiedades

var relleno = new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.6)'
});

var trazo = new ol.style.Stroke({
    width: 3,
    color: [255, 0, 0, 1]
});

// Creamos el círculo

var circulo = new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({ color: 'black' }),
    stroke: new ol.style.Stroke({ color: 'white', width: 2 })
});

// Creamos un estilo

var circulo_negro = new ol.style.Style({
    image: circulo,
    stroke: trazo,
    fill: relleno
});

var estilo_mountain = new ol.style.Style({
    image: image_mountain
});

// Creamos un layer y la añadimos al mapa


// -------------------------- //
//  MONTAÑAS MÁS IMPORTANTES //
// -------------------------- //

// Vamos a crear una segunda capa en la que incluiremos los POIs (point of interest)
// Hay que transformar las coordenadas porque sino no va

var mountains = [];

mountains.push(ol.proj.transform([2.52145, 39.69000], 'EPSG:4326', 'EPSG:3857'));
mountains.push(ol.proj.transform([2.79782, 39.81050], 'EPSG:4326', 'EPSG:3857'));
mountains.push(ol.proj.transform([2.8529806, 39.8060306], 'EPSG:4326', 'EPSG:3857'));

// Creamos una característica que contenga un punto en donde queremos

var caracteristicas = [];

caracteristicas.push(new ol.Feature({ geometry: new ol.geom.Point(mountains[0]), name: 'Null Island' }))
caracteristicas.push(new ol.Feature({ geometry: new ol.geom.Point(mountains[1]), name: 'Null Island' }))
caracteristicas.push(new ol.Feature({ geometry: new ol.geom.Point(mountains[2]), label: 'hola', name: 'Null Island' }))


var capa_verGeo = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: caracteristicas
    }),
    style: estilo_mountain
});



var style = {
    'Point': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#8c2210'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#000',
                width: 1
            })
        })
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f45c42',
            width: 3
        })
    })
};

// -------------------------- //
//  MAPAS KML //
// -------------------------- //

var capa_refugios = new ol.layer.Vector({
    source: new ol.source.Vector({
        //projection: 'EPSG:3857',
        url: 'kml/refugios.kml',
        format: new ol.format.KML({
            extractStyles: false,
            //showPointNames: true
        })
    }),
    style: icono_refugio
});


var exc_cami_des_correu = new ol.layer.Vector({
    source: new ol.source.Vector({
        //projection: 'EPSG:3857',
        url: 'kml/exc_cami_des_correu.kml',
        format: new ol.format.KML({
            extractStyles: false,
            //showPointNames: true
        })
    }),
    style: function (feature) {
        return style[feature.getGeometry().getType()];
    }
});



var exc_port_des_canonge = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'gpx/B4122_015_Canonge.gpx',
        format: new ol.format.GPX()
    }),
    style: function (feature) {
        return style[feature.getGeometry().getType()];
    }
});

var missitios = new ol.layer.Vector({
    source: new ol.source.Vector({
        //projection: 'EPSG:3857',
        url: 'kml/missitios.kml',
        format: new ol.format.KML({
            extractStyles: false,
            //showPointNames: true
        })
    }),
    style: function (feature) {
        return style[feature.getGeometry().getType()];
    }
});

mapaMallorca.addLayer(missitios);



mapaCorreu.addLayer(exc_port_des_canonge);

mapaMallorca.addLayer(exc_cami_des_correu);
mapaMallorca.addLayer(exc_port_des_canonge);

// Festival de animaciones
// En función del botón que pulsemos, nos llamará a una función
// que recentrará el mapa según la ruta que se quiera visuali


function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
}

onClick('pal-to-cami_des_correu', function () { recentrar(center_cami_des_correu, 2000, 14); });
onClick('pal-to-volta_des_general', function () { recentrar(center_volta_des_general, 2000, 15); });

function recentrar(centro_mapa, duracion, zoom) {
    vistaMallorca.animate({
        center: centro_mapa,
        duration: duracion,
        zoom: zoom
    });
}


// Teóricamente esto debería de funcionar y centrar
// según la zona que ocupe la ruta. La cosa es que no va
// TO-DO: Arreglar para que funcione

/*

                var vs = new ol.source.Vector({
//projection: 'EPSG:3857',
url: 'kml/exc_cami_des_correu.kml',
format: new ol.format.KML({
                    extractStyles: false,
                    //showPointNames: true
                })
})

//				alert(vs.getExtent());

        mapaMallorca.getView().fit(
            vs.getExtent(), 
            { duration: 1000 }
        );
        mapaMallorca.setCenter();
        */



var kmlSources = ['gpx/B4122_001_Bruta.gpx',
    'gpx/B4122_002_Andritxol.gpx',
    'gpx/B4122_003_PortalsVells.gpx',
    'gpx/B4122_004_Farineta.gpx',
    'gpx/B4122_005_dAndratx-SantElm.gpx',
    'gpx/B4122_006_Dragonera.gpx',
    'gpx/B4122_007_Trapa.gpx',
    'gpx/B4122_008_Fab¡oler.gpx',
    'gpx/B4122_009_MiradordesesSinies.gpx',
    'gpx/B4122_010_SEsclop.gpx',
    'gpx/B4122_011_Galatzo_A.gpx',
    'gpx/B4122_012_Galatzo_B_neu-zusammen.gpx',
    'gpx/B4122_013_FitadelRam.gpx',
    'gpx/B4122_014_Correu.gpx',
    'gpx/B4122_015_Canonge.gpx',
    'gpx/B4122_016_Valldemossa_A.gpx',
    'gpx/B4122_017_Valldemossa_B.gpx',
    'gpx/B4122_018_Valldemossa-Dei.gpx',
    'gpx/B4122_020_Foradada.gpx',
    'gpx/B4122_021_Bunyola.gpx',
    'gpx/B4122_022_Soller-Dei.gpx',
    'gpx/B4122_02B_deCostello-Soller.gpx',
    'gpx/B4122_024_Calobra.gpx',
    'gpx/B4122_025_Cuber-Soller.gpx',
    'gpx/B4122_026_TossalsVerds.gpx',
    'gpx/B4122_027_CanaletadeMassanella.gpx',
    'gpx/B4122_028_CastelldAlaro.gpx',
    'gpx/B4122_029_Cuber-Lluc.gpx',
    'gpx/B4122_030_lluc.gpx',
    'gpx/B4122_0B1_TorrentdePare¡s_A.gpx',
    'gpx/B4122_032_TorrentdePare¡s_B.gpx',
    'gpx/B4122_033_TorredesaMoladeTuent.gpx',
    'gpx/B4122_034_PuigRoig.gpx',
    'gpx/B4122_035_Tomir.gpx',
    'gpx/B4122_036_deLluc.gpx',
    'gpx/B4122_037_Massanella_A.gpx',
    'gpx/B4122_038_Massanella_B.gpx',
    'gpx/B4122_039_Mortitx.gpx',
    'gpx/B4122_041_Maria.gpx',
    'gpx/B4122_042_Boquer.gpx',
    'gpx/B4122_043_CastelldelRei.gpx',
    'gpx/B4122_044_Fumat.gpx',
    'gpx/B4122_019_SEstaca.gpx'];


for (var posicion = 0; posicion < kmlSources.length; posicion++) {

    //alert(kmlSources[posicion]);
    var kmlLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: kmlSources[posicion],
            format: new ol.format.GPX()
        }),
        style: function (feature) {
            return style[feature.getGeometry().getType()];
        }
    });

    mapaMallorca.addLayer(kmlLayer);

};

mapaMallorca.addLayer(capa_verGeo);
mapaMallorca.addLayer(capa_refugios);


var info = document.getElementById('info');
var target = document.getElementById('mapaMallorca');

function displayFeatureInfo(pixel) {

    info.style.left = pixel[0] + 'px';
    info.style.top = pixel[1] + 200 + 'px';

    var feature = mapaMallorca.forEachFeatureAtPixel(pixel, function (feature, layer) {
        return feature;
    });

    if (feature) {
        var text = feature.get('name');
        info.style.display = 'none';
        info.innerHTML = text;
        info.style.display = 'block';
        target.style.cursor = "pointer";
    } else {
        info.style.display = 'none';
        target.style.cursor = "";
    }
}





mapaMallorca.on('click', function (evt) {

    displayFeatureInfo(evt.pixel);



});


