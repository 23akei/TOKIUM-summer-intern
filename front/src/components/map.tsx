import React, { useEffect } from 'react';
import { AdvancedMarker as Marker, Map, APIProvider } from '@vis.gl/react-google-maps';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '400px'
};

const center = { lat: -34.397, lng: 150.644 };

const GMap: React.FC = () => {

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      center.lat = position.coords.latitude;
      center.lng = position.coords.longitude;
    });
  });

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
      >
      </Map>
    </APIProvider>
  );
};

export default GMap;
