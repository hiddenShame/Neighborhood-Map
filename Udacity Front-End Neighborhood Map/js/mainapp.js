var nbhBusiness = [{
        name: '99 Favor Taste',
        loc: {
            lat: 40.717522,
            lng: -73.992584
        },
        tag: '99favortasteofficial',
    },
    {
        name: 'Hong Kong Supermarket',
        loc: {
            lat: 40.717662,
            lng: -73.995994
        },

        tag: 'hong-kong-supermarket'
    },
    {
        name: 'The Pickle Guys',
        loc: {
            lat: 40.716436,
            lng: -73.989062
        },

        tag: 'pickleguys'
    },
    {
        name: 'Tinys Giant Sandwich Shop',
        loc: {
            lat: 40.719562,
            lng: -73.986943
        },

        tag: 'tinysgiantnyc'
    },
    {
        name: 'Essex Street Market',
        loc: {
            lat: 40.719105,
            lng: -73.987625
        },

        tag: 'essexstreetmarket'
    },
    {
        name: 'Tenement Museum',
        loc: {
            lat: 40.718795,
            lng: -73.990066
        },

        tag: 'thetenementmuseum'
    }
];

var map;

var Location = function(data) {
    var self = this;
    this.name = data.name;
    this.lat = data.loc.lat;
    this.lng = data.loc.lng;
    this.loc = this.lat + ',' + this.lng;
    this.tag = data.tag;
    this.marker = data.marker;
    this.visible = ko.observable(true);
    console.log(this.loc);
}

function ListViewModel() {
    var self = this;

    self.locationListArray = ko.observableArray([]);
    self.searchTerm = ko.observable('');
    drawMap();
    this.infoWindow = new google.maps.InfoWindow();
 	//http://knockoutjs.com/examples/collections.html
    nbhBusiness.forEach(function(locationItem) {
        var foursquareData = 'https://api.foursquare.com/v2/venues/search?ll=' + locationItem.loc.lat + ',' + locationItem.loc.lng + '&client_id=VQCG1EXVI4JPLYN44WCUJEEIGDH5MNI2J24THTBBCTMUVHIY&client_secret=O5GMDYMMGYEST3JA0YODFIRIC5NND0A4PUP4FIMTM30DR4KD&v=20171201&query=' + locationItem.name;
        console.log(foursquareData);
        var marker = new google.maps.Marker({
            position: locationItem.loc,
            map: map,
            title: locationItem.name,
            tag: locationItem.tag
        });
        locationItem.marker = marker;
        console.log(locationItem.marker);
        
        marker.setMap(map);
        
        locationItem.marker.addListener('click', function() {
        	//request foursquare API data
            $.getJSON(foursquareData).done(function(data) {
                var venues = data.response.venues[0];
                self.place = venues.categories[0].name;
                self.street = venues.location.formattedAddress[0];
                self.city = venues.location.formattedAddress[1];
                self.country = venues.location.formattedAddress[2];
                self.formattedAddress = self.street + ', ' + self.city;
                
                console.log(self.formattedAddress);
                self.infoContent = '<div>' + locationItem.name + '</div>' + '<div>' + self.place + '</div>' + '<div>' + self.formattedAddress + '</div>' + '<div>' + self.country + '</div>' + '<div>' + locationItem.tag + '</div>';
                self.infoWindow.open(map, locationItem.marker);
                console.log(locationItem.name);
                self.infoWindow.setContent(self.infoContent);

            }).fail(function() {
                alert("Error with the Foursquare API call. Please try again later.");
            });

            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout((function() {
                this.setAnimation(null);
            }).bind(this), 1000);

        });

        self.Bounce = function(locationItem) {
            console.log(locationItem.tag);
            google.maps.event.trigger(locationItem.marker, 'click');
            console.log(locationItem.marker);
        }
        self.locationListArray().push(new Location(locationItem));
    });

    this.filterM = ko.computed(function() {
        var term = self.searchTerm().toLowerCase();
        if (!term) {
            self.locationListArray().forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return self.locationListArray();
        } else {
            return ko.utils.arrayFilter(self.locationListArray(), function(locationItem) {
                var name = locationItem.name.toLowerCase();
                var found = (name.search(term) >= 0);
                locationItem.visible(found);
                return found;
            });
        }
    }, this);




} //end of ListViewModel

function drawMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7180628,
            lng: -73.9961237
        },
        zoom: 13
    });
}
function mapError() {
    alert("Failed to load Google Maps. Please try again later.");
}
function runApp() {
    ko.applyBindings(new ListViewModel());
}