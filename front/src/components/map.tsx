import React, { useEffect, useState } from 'react';
import { Map, APIProvider, MapMouseEvent, useMapsLibrary } from '@vis.gl/react-google-maps';

const containerStyle: React.CSSProperties = {
  padding: '20px',
  width: '100%',
  height: '600px',
  minWidth: '500px',
};

const GMap: React.FC = () => {
  const [center, setCenter] = useState({ lat: 35.6809591, lng: 139.7673068 });

  const handleMapClick = async (event: MapMouseEvent) => {
    const placeId = event.detail.placeId;
    console.log("clicked place id: "+placeId);
    if (!placeId) {
      return;
    }
    // get place details
    const ps = new google.maps.places.PlacesService(event.map);
    const request = {
      placeId: placeId,
      fields: ["name", "formatted_address", "place_id", "geometry"],
    };
    ps.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        console.log("place name: "+place.name);
      }
    });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      version='weekly'
      region='JP'
    >
      <Map
        mapId={import.meta.env.VITE_GOOGLE_MAPS_API_MAP_ID}
        style={containerStyle}
        defaultCenter={center}
        defaultZoom={15}
        zoomControl={true}
        disableDefaultUI={true}
        mapTypeControl={true}
        onClick={handleMapClick}
      >
      </Map>
    </APIProvider>
  );
};

export default GMap;
