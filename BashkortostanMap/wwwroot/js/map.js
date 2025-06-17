const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([56.0, 54.5]),
        zoom: 6
    })
});

let districtData = {};

fetch('/data/values.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            districtData[item.id] = item.value;
        });

        return fetch('/data/bashkortostan.json');
    })
    .then(response => response.json())
    .then(geojson => {
        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(geojson, {
                featureProjection: 'EPSG:3857'
            })
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: function (feature) {
                const id = feature.get('id') || feature.get('properties')?.id;
                const value = districtData[id];

                let fillColor = 'rgba(200, 200, 200, 0.5)'; // базовый серый

                if (value !== undefined) {
                    if (value >= 0 && value <= 25) fillColor = 'rgba(255, 0, 0, 0.6)';      // красный
                    else if (value <= 50) fillColor = 'rgba(255, 165, 0, 0.6)';    // оранжевый
                    else if (value <= 75) fillColor = 'rgba(255, 255, 0, 0.6)';    // желтый
                    else if (value <= 100) fillColor = 'rgba(0, 128, 0, 0.6)';      // зеленый
                }

                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#333',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: fillColor
                    })
                });
            }
        });

        map.addLayer(vectorLayer);

        // Всплывающая подсказка
        const info = document.getElementById('info');

        map.on('pointermove', function (evt) {
            const pixel = map.getEventPixel(evt.originalEvent);
            const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });

            if (feature) {
                const id = feature.get('id') || feature.get('properties')?.id;
                const name = feature.get('name') || feature.get('properties')?.name || 'Без названия';
                const value = districtData[id] !== undefined ? districtData[id] + '%' : 'нет данных';

                info.style.left = (evt.originalEvent.pageX + 10) + 'px';
                info.style.top = (evt.originalEvent.pageY + 10) + 'px';
                info.innerHTML = `<strong>${name}</strong> - ${value}`;
                info.style.display = 'block';
            } else {
                info.style.display = 'none';
            }
        });

        // Изменяем курсор при наведении на регион
        map.on('pointermove', function (e) {
            const pixel = map.getEventPixel(e.originalEvent);
            const hit = map.hasFeatureAtPixel(pixel);
            map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });
    })
    .catch(err => console.error('Ошибка загрузки данных:', err));

//const map = new ol.Map({
//    target: 'map',
//    layers: [
//        new ol.layer.Tile({
//            source: new ol.source.OSM()
//        })
//    ],
//    view: new ol.View({
//        center: ol.proj.fromLonLat([56.0, 54.5]), // Центр Башкортостана
//        zoom: 6
//    })
//});

//// Загружаем GeoJSON
//fetch('/data/bashkortostan.json')
//    .then(response => response.json())
//    .then(data => {
//        const vectorSource = new ol.source.Vector({
//            features: new ol.format.GeoJSON().readFeatures(data, {
//                featureProjection: 'EPSG:3857' // обязательно для правильного отображения на OSM
//            })
//        });

//        const vectorLayer = new ol.layer.Vector({
//            source: vectorSource,
//            style: new ol.style.Style({
//                stroke: new ol.style.Stroke({
//                    color: '#FF0000',
//                    width: 2
//                }),
//                fill: new ol.style.Fill({
//                    color: 'rgba(255, 0, 0, 0.1)'
//                })
//            })
//        });

//        map.addLayer(vectorLayer);

        //// Всплывающая подсказка
        //const info = document.getElementById('info');

        //// Используем событие 'pointermove'
        //map.on('pointermove', function (evt) {
        //    const pixel = map.getEventPixel(evt.originalEvent);
        //    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        //        return feature;
        //    });

        //    if (feature) {
        //        const name = feature.get('name') || 'Без названия';
        //        info.style.left = (evt.originalEvent.pageX + 10) + 'px';
        //        info.style.top = (evt.originalEvent.pageY + 10) + 'px';
        //        info.innerHTML = name;
        //        info.style.display = 'block';
        //    } else {
        //        info.style.display = 'none';
        //    }
        //});

//    })
//    .catch(err => console.error('Ошибка загрузки GeoJSON:', err));
