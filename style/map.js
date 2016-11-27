// -------------------- >> MODEL <<
// List of locations in the neighborhood, hard coded.
var locations = [{
    title: 'Home sweet home',
    titleKo: '아라아이파크',
    tag: 'home',
    description: 'My home far far away from where I am now.',
    location: {
        lat: 33.476048,
        lng: 126.550555
    }
}, {
    title: 'Nilmori Dong dong',
    titleKo: '제주 닐모리동동',
    tag: 'cafe',
    description: 'A coffe house with beautiful interior by the coast. Owned by a big online game company.',
    location: {
        lat: 33.517761,
        lng: 126.487830
    }
}, {
    title: 'Cacadew',
    titleKo: '제주 카카듀',
    tag: 'cafe',
    description: 'A coffee house that is more famouse for its gargantuan tower of shaved ice with matcha icecream.',
    location: {
        lat: 33.491275,
        lng: 126.541777
    }
}, {
    title: 'Dreaming White Donkey',
    titleKo: '제주 꿈꾸는 흰당나귀',
    tag: 'cafe',
    description: 'A shaved ice place that is considered one of the best in the island.',
    location: {
        lat: 33.497882,
        lng: 126.529283
    }
}, {
    title: 'Lowa',
    titleKo: '제주 카페 로와',
    tag: 'cafe',
    description: 'Coffe house by the coast. Has an open rooftop with glass walls that gives a beautiful view of the coast',
    location: {
        lat: 33.556064,
        lng: 126.795327
    }
}, {
    title: 'Doraji',
    titleKo: '제주 도라지식당',
    tag: 'restaurant',
    description: 'My personal favorite Korean traditional meal place. Has a great seafood menus.',
    location: {
        lat: 33.492708,
        lng: 126.505968
    }
}, {
    title: 'Roost',
    titleKo: '제주 루스트',
    tag: 'restaurant',
    description: 'Great happy hour menu. Three dollars gorgonzola pizza and beer!',
    location: {
        lat: 33.473928,
        lng: 126.545084
    }
}, {
    title: 'Oppa Chiken',
    titleKo: '제주 오빠닭',
    tag: 'restaurant',
    description: 'Fried chicken and beer place',
    location: {
        lat: 33.489421,
        lng: 126.533127
    }
}, {
    title: 'The Red House',
    titleKo: '제주 빨간집',
    tag: 'restaurant',
    description: 'Serves everything super spicy including ramen, pork ribs, and chicken.',
    location: {
        lat: 33.498799,
        lng: 126.5309179961237
    }
}, {
    title: 'Innisfree',
    titleKo: '제주 이니스프리하우스 ',
    tag: 'mustgo',
    description: 'A cosmetics shop located on top of a beautiful hill, right next to a big green tea leaf farm. Sells limited edition products.',
    location: {
        lat: 33.3065761,
        lng: 126.2912568
    }
}, {
    title: 'Oh-Sullock',
    titleKo: '제주 오설록',
    tag: 'mustgo',
    description: 'Green tea place with beautiful building and interior. Also has a cafe that serves greentea roll cakes, tea, icecream, and more.',
    location: {
        lat: 33.305725,
        lng: 126.289772
    }
}, {
    title: 'Top-dong park',
    titleKo: '제주 탑동 시민공원',
    tag: 'mustgo',
    description: 'Park for the local people.',
    location: {
        lat: 33.517753,
        lng: 126.526995
    }
}, {
    title: 'Joosang Julli',
    titleKo: '제주 주상절리',
    tag: 'mustgo',
    description: 'Tall hexagonal rock formation.',
    location: {
        lat: 33.237732,
        lng: 126.425084
    }
}, {
    title: 'Marilyn Monroe cafe',
    titleKo: '제주 우도 마를린 먼로',
    tag: 'cafe',
    description: 'Marilyn Monroe cafe that serves great peanut-icecream.',
    location: {
        lat: 33.5144529,
        lng: 126.957487
    }
}, {
    title: 'Halla mountain',
    titleKo: '한라산',
    tag: 'mustgo',
    description: 'Beautiful volcanic mountain.',
    location: {
        lat: 33.36091,
        lng: 126.5365854
    }
}, ];

// Creates an array of tag strings, which will be used as a filter in the drop down menu.
var tags = locations.map(function(a) {
    return a.tag;
});
for (var i; i < locations.length; i++) {
    tags.push(locations[i].tag);
}
var category = jQuery.unique(tags);


// -------------------- VIEW MODEL <<
function ViewModel() {
    var self = this;
    self.locationList = ko.observableArray(locations);
    self.tagList = ko.observableArray(tags);

    // Filters location by the category selected from a drop down menu
    self.filterListBy = ko.observable();
    self.filteredList = ko.observableArray(locations);
    self.filteredList = ko.computed(function() {
        var filterBy = self.filterListBy();
        if (!filterBy)
            return self.locationList();
        return ko.utils.arrayFilter(self.locationList(), function(aLocationInList) {
            return aLocationInList.tag === filterBy;
        });
    });

    self.filterListBy.subscribe(function() {
        // hideListings is required to delete any selection made when new list selection is made
        hideListings();
        showListings();
    });

    self.currentMarker = ko.observable;
    showInformation = function(place) {
        console.log(place);
        hideListings(self.currentMarker);
        self.currentMarker = place.marker;
        showMarker(self.currentMarker);
        dropMarker(self.currentMarker);
        populateInfoWindow(self.currentMarker, place.info);
    };

    // Combine "show all listings" and "hide all listings" buttons
    // Reference: http://stackoverflow.com/questions/14867906/knockoutjs-value-toggling-in-data-bind
    self.showListingsMessage = ko.observable(false);
    self.hideListingsMessage = ko.observable(true);
    showHideListings = function() {
        this.showListingsMessage(!this.showListingsMessage());
        this.hideListingsMessage(!this.hideListingsMessage());
        // Reference: http://stackoverflow.com/questions/32266149/toggle-with-two-functions
        // The "truthness" of the showMessage function and the function that it show/hides the messages are the opposite because
        // If the current status the button is "Show Listings", then the map currently "hides" all labels.
        if (this.showListingsMessage()) {
            hideListings();
        } else {
            showListings();
        }
    };

    self.showListingsMessage.subscribe(function() {
        console.log(self.filteredList());
        showListings();
    })
    self.hideListingsMessage.subscribe(function() {
        console.log(self.filteredList());
        hideListings();
    });
    islandView = function() {
        zoomToIslandView();
    };

    // Highlights marker icon when mouse is over, and un-highlights when mouse leaves
    iconMouseOver = function() {
        this.marker.setIcon(highlightedIcon);
    }, iconMouseOut = function() {
        this.marker.setIcon(defaultIcon);
    }

    self.displayError = ko.observable(1);
    self.googleErrorImage = ko.observable();
    self.googleErrorDetails = ko.observable();

    // Accuweather Movel View
    self.weather = ko.observable();
    self.googleWeatherURL = ko.observable();
    self.details = ko.observable();
    self.weatherErrorMessage = ko.observable();
}

var vm = new ViewModel();

var defaultIcon = 'img/marker-blue-min.png';
var highlightedIcon = 'img/marker-red-min.png';

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 33.363385,
            lng: 126.528909
        },
        zoom: 11,
        mapTypeControl: false
    });
    var largeInfowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });

    var currentLocation = locations;
    vm.currentMarker = new google.maps.Marker();
    markerList = [];
    var i;

    for (i = 0; i < currentLocation.length; i++) {
        var position = currentLocation[i].location;
        var title = currentLocation[i].title;
        var description = currentLocation[i].description;
        // Set icon colors

        var marker = new google.maps.Marker({
            position: position,
            description: description,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
        });

        markerList.push(marker);
        currentLocation[i].marker = marker;

        currentLocation[i].info = largeInfowindow;

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            dropMarker(this);
        });

        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        // When a marker is selected, zooms into the marker position
        // Reference: https://developers.google.com/maps/documentation/javascript/examples/event-simple
        marker.addListener('click', function() {
            map.setZoom(13);
            map.setCenter(this.location);
        });
    }

    showListings();
    ko.applyBindings(vm);
}

// Make an array of images to present upon error with Google API.
var imageList = [];
var i;
for (i = 0; i < 13; i++) {
    imageList[i] = 'img/jeju/jeju' + i + '.jpg';
}

var index = 0;

// Present images every 5 seconds.
function imageTransition() {
    setInterval(function() {
        index = (index + 1) % 14;
        var currentImg = 'img/jeju/jeju' + index + '-min.jpg';
        vm.googleErrorImage(currentImg);
        console.log(index);
        console.log(currentImg);
    }, 5000)
}

// Google API error message.
function mapError() {
    ko.applyBindings(vm);
    vm.displayError(10);
    vm.googleErrorDetails('View');
    imageTransition();
}

var markerList = [];
var selectedMarker = [];

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<h4>' + marker.title + '</h4>' + '<p>' + marker.description + '</p>' + '<div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }

        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

function showListings() {
    for (var i = 0; i < vm.filteredList().length; i++) {
        vm.filteredList()[i].marker.setMap(map);
    }
}

function showMarker(thisMarker) {
    thisMarker.setMap(map);
}

function hideMarker(thisMarker) {
    thisMarker.setMap(map);
}

function zoomToIslandView() {
    map.setZoom(11);
    map.setCenter({
        lat: 33.363385,
        lng: 126.528909
    });
};

function dropMarker(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.DROP);
    }
}
// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


// ACCUWEATHER styles.
var isMetric = false;
var currentConditionsUrl;

function awxGetCurrentConditions() {
    currentConditionsUrl = "http://apidev.accuwe!!!ather.com/currentconditions/v1/224209.json?language=en&apikey=hoArfRosT1215";
    $.ajax({
        type: "GET",
        url: currentConditionsUrl,
        dataType: "jsonp",
        cache: true, // Use cache for better reponse times
        jsonpCallback: "awxCallback", // Prevent unique callback name for better reponse times
        success: function(data) {
            var html;
            if (data && data.length > 0) {
                var conditions = data[0];
                var temp = isMetric ? conditions.Temperature.Metric : conditions.Temperature.Imperial;
                condition = conditions.WeatherText;
                temperature = temp.Value + " " + temp.Unit;
            } else {
                html = "N/A";
            }
            vm.weather("Jeju Island is currently " + condition + " and temperature is " + temperature + ".");
        },
        error: function() {
            vm.googleWeatherURL("https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=jeju%20weather");
            vm.weatherErrorMessage("Click to check current weather in Jeju!")
        }
    });
};

awxGetCurrentConditions();
