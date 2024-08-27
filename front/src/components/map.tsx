import React from 'react';
import { AdvancedMarker as Marker, Map, APIProvider } from '@vis.gl/react-google-maps';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '400px'
};

const center = { lat: -34.397, lng: 150.644 };

const GMap: React.FC = () => {
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      version='weekly'
      region='JP'
    >
      <Map
        mapId={import.meta.env.VITE_GOOGLE_MAPS_API_MAP_ID}
        style={containerStyle}
        center={center}
        zoom={10}
        defaultCenter={{lat: 22.54992, lng: 0}}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <Marker position={center} />
      </Map>
    </APIProvider>
  );
};

export default GMap;
