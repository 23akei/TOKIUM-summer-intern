import React, { useEffect, useState } from 'react';
import { Map, APIProvider, MapMouseEvent } from '@vis.gl/react-google-maps';

const containerStyle: React.CSSProperties = {
  padding: '20px',
  width: '100%',
  height: '500px',
};

const GMap: React.FC = () => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });

  const handleMapClick = (event: MapMouseEvent) => {
    console.log("clicked place id:"+event.detail.placeId);
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
