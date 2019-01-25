export const MAP_DEFAULTS = {
  latitude: 35.78458670681999,
  longitude: -78.67019681930537,
  zoom: 16
};

export const STANDARD = [ ];

export const STANDARD_NO_LABEL = [
  {
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative.neighborhood',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  }
];

export const DARK = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#242f3e'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#746855'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#242f3e'
      }
    ]
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#293c4e'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#263c3f'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#6b9a76'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#38414e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#212a37'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9ca5b3'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#746855'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#1f2835'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#f3d19c'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2f3948'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#17263c'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#515c6d'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#17263c'
      }
    ]
  }
];

export const DARK_NO_LABEL = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#242f3e'
      }
    ]
  },
  {
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#746855'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#242f3e'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'administrative.neighborhood',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#293c4e'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#263c3f'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#6b9a76'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#38414e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#212a37'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9ca5b3'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#746855'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#1f2835'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#f3d19c'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2f3948'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#17263c'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#515c6d'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#17263c'
      }
    ]
  }
];
