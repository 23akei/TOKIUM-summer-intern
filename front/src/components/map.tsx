import React, { useEffect, useState } from 'react';
import { Map, APIProvider, MapMouseEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '60vh',
  minWidth: '500px',
};

interface GMapProps {
  setShopName: (name: string) => void;
}

const GMap: React.FC<GMapProps> = ({setShopName}) => {
  const [shopName, setShopNameFrom] = useState<string>("");
  useEffect(() => {
    setShopName(shopName);
  }, [shopName]);

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      version='weekly'
      region='JP'
    >
      <GMapContent setShopName={setShopNameFrom} />
    </APIProvider>
  );
};

const GMapContent: React.FC<GMapProps> = ({setShopName}) => {
  const [center, setCenter] = useState({ lat: 35.6809591, lng: 139.7673068 });
  const placesService = usePlacesService();

  useEffect(() => {
    // get current location
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);

  // handle map click event, get place details
  const handleMapClick = (event: MapMouseEvent) => {
    const placeId = event.detail.placeId;
    console.log("clicked place id: "+placeId);
    if (!placeId) return;
    // get place details
    if (!placesService) return;
    const request = {
      placeId: placeId,
      fields: ["name", "formatted_address", "place_id", "geometry"],
    };
    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        console.log("place name: "+place.name);
        setShopName(place.name || "");
      }
    });
  };

  return (
    <Map
      mapId={import.meta.env.VITE_GOOGLE_MAPS_API_MAP_ID}
      style={containerStyle}
      defaultCenter={center}
      defaultZoom={15}
      zoomControl={true}
      disableDefaultUI={true}
      mapTypeControl={true}
      onClick={handleMapClick}
      reuseMaps={true}
    />
  );
};

function usePlacesService() {
  const [placesService, setPlaceService] = useState<google.maps.places.PlacesService | null>(null);
  const placesLibrary = useMapsLibrary("places");
  const map = useMap();

  useEffect(() => {
    if (!placesLibrary || !map) {
      console.log("places library or map not ready");
      console.log(placesLibrary);
      console.log(map);
      return;
    }
    console.log("places library loaded");
    setPlaceService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  return placesService;
}

export default GMap;
