import React, { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  place_id: string;
  name: string;
}

interface PlacesListProps {
  location: Location;
}

const PlacesList: React.FC<PlacesListProps> = ({ location }) => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&type=restaurant&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}`);
      const data = await response.json();
      setPlaces(data.results);
    };

    fetchPlaces();
  }, [location]);

  return (
    <div>
      <h2>Nearby Places</h2>
      <ul>
        {places.map(place => (
          <li key={place.place_id}>{place.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlacesList;
