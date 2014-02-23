'use strict';

var FieldBase = require('informal').bases.Field,
	bind = require('mout/function/bind'),
	zen = require('elements/zen');

var maps = window.google.maps;

/**
 * @param {Object} spec
 */
var FieldLocation = function(spec, value){
	if (!(this instanceof FieldLocation)){
		return new FieldLocation(spec, value);
	}
	FieldBase.call(this, spec, value);
};

FieldLocation.prototype = Object.create(FieldBase.prototype);
FieldLocation.prototype.constructor = FieldLocation;

/**
 *
 */
FieldLocation.prototype.build = function(){
	this.wrap = zen('li.field-location');
	var input = zen('input[type=text].map-search'),
		canvas = zen('div.map-canvas').insert(this.wrap);

	var ul = zen('ul').insert(this.wrap),
		li = zen('li').insert(ul);
	zen('label').text('Address').insert(li);
	var address = zen('textarea').insert(li);
	li = zen('li').insert(ul);
	zen('label').text('Latitude').insert(li);
	var latitude = zen('input[type=text]').insert(li);
	li = zen('li').insert(ul);
	zen('label').text('Longitude').insert(li);
	var longitude = zen('input[type=text]').insert(li);

	this.map = new maps.Map(canvas[0], {
		center: new maps.LatLng(52.3666513, 4.892005899999958),
		zoom: 14,
		mapTypeId: maps.MapTypeId.ROADMAP
	});

	this.map.controls[maps.ControlPosition.TOP_LEFT].push(input[0]);

	this.marker = new maps.Marker({
		map: this.map
	});

	this.autocomplete = new maps.places.Autocomplete(input[0], {
		types: ['geocode']
	});
	maps.event.addListener(this.autocomplete, 'place_changed', bind(function(){
		this.marker.setVisible(false);

		var place = this.autocomplete.getPlace();
		if (!place.geometry) {
			// TODO: warn the user place is not found
			// console.warn('place not found');
			return;
		}

		if (place.geometry.viewport) {
			this.map.fitBounds(place.geometry.viewport);
		} else {
			this.map.setCenter(place.geometry.location);
		}

		this.marker.setPosition(place.geometry.location);
		this.marker.setVisible(true);

		address.value(place.formatted_address.split(/\s*,\s*/).join('\n'));
		latitude.value(place.geometry.location.lat());
		longitude.value(place.geometry.location.lng());
	}, this));
};

module.exports = FieldLocation;
