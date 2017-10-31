ymaps.ready(['Heatmap']).then(function init() {
	var myMap = new ymaps.Map('map', {
		center: [53.18985921947444,50.114735999180475],
		zoom: 8,
		controls: ['zoomControl', 'typeSelector']
	});

	var delta = 0.04
	coords = []
	for (i = 0; i < hospitals.length; i++)
		coords[i] = createHospital(hospitals[i])
	Promise.all(coords).then(function (res) {
		data = []
		for (i = 0; i < res.length; i++)
			for (j = 0; j < res[i].patients; j++)
				data.push([res[i].coordinates[0] + Math.random() * 2 * delta - delta, 
					   res[i].coordinates[1] + Math.random() * 2 * delta - delta])
		var heatmap = new ymaps.Heatmap(data, {
			radius: 15,
        		dissipating: false,
        		opacity: 0.8,
        		intensityOfMidpoint: 0.2,
        		gradient: {
				0.1: 'rgba(128, 255, 0, 0.7)',
				0.2: 'rgba(255, 255, 0, 0.8)',
				0.7: 'rgba(234, 72, 58, 0.9)',
				1.0: 'rgba(162, 36, 25, 1)'
			}
		});
		//heatmap.setMap(myMap);
	})

	//boundaries.features[16].geometry.coordinates
	console.log(boundaries.features[16].properties.NAME)
	boundaries.features.forEach(createRegion)
	function createRegion(region) {
		if (region.properties.ADMIN_LVL != '6')
			return
		var coords = region.geometry.coordinates
		for (i = 0; i < coords.length; i++)
			for (j = 0; j < coords[i].length; j++)
				coords[i][j] = [coords[i][j][1], coords[i][j][0]]
		var myPolygon = new ymaps.Polygon(coords,
			{ hintContent: region.properties.NAME },
		//	{ fillColor: 'rgba('+Math.floor(Math.random()*255)+', 0, 0, 0.4)', strokeWidth: 1})
			{ fillColor: 'rgba(255, 0, 0, '+(Math.random()/3+0.25)+')', strokeWidth: 0})
		myMap.geoObjects.add(myPolygon)
	}

	function createHospital(hospital) {
		return ymaps.geocode(hospital.address).then(function (res) {
			result = res.geoObjects.get(0).geometry._coordinates
			var placemark = new ymaps.Placemark(result, {
				balloonContent: hospital.name+'<br>Заполненность: '+hospital.patients+'/'+hospital.berths
			}, {
				preset: 'islands#redIcon'
			})
			myMap.geoObjects.add(placemark)
			return {coordinates: result, patients: hospital.patients}
		});
	}
})

