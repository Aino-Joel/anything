import React, { useState, useEffect } from 'react';
import './App.css';
import '.index';

function App() {
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsDisplay, setDirectionsDisplay] = useState(null);

  useEffect(() => {
    initMap();
  }, []);

  
  const initMap = () => {
    const newMap = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });

    setMap(newMap);
    setDirectionsService(new window.google.maps.DirectionsService());
    const newDirectionsDisplay = new window.google.maps.DirectionsRenderer();
    newDirectionsDisplay.setMap(newMap);
    setDirectionsDisplay(newDirectionsDisplay);
  };

  const searchPlace = () => {
    const placeName = document.getElementById('placeInput').value;

    const request = {
      query: placeName,
      fields: ['name', 'geometry', 'reviews', 'user_ratings_total'],
    };

    const service = new window.google.maps.places.PlacesService(map);

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const place = results[0];
        showPlaceDetails(place);
        showDirections(place.geometry.location);
        showStaticMap(place.geometry.location);
      } else {
        alert('Place not found');
      }
    });
  };

  const showPlaceDetails = (place) => {
    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `
      <h2>${place.name}</h2>
      <p>Reviews: ${place.reviews ? place.reviews.length : 'N/A'}</p>
      <p>Searches: ${place.user_ratings_total || 'N/A'}</p>
      <p>Ratings: ${place.rating || 'N/A'}</p>
    `;
  };

  const showDirections = (destination) => {
    const origin = { lat: -34.397, lng: 150.644 };
    const request = {
      origin,
      destination,
      travelMode: 'DRIVING',
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  };

  const showStaticMap = (location) => {
    const staticMap = document.getElementById('staticMap');
    staticMap.src = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=14&size=400x400&markers=${location.lat},${location.lng}&key=AIzaSyC2Xit0UM10rIOVUm`;
    staticMap.style.display = 'block';
  };

  return (
    <div>
      <button onClick="searchPlace">Search Place</button>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
      <div id="info"></div>
      <img id="staticMap" alt="Static Map" style={{ maxWidth: '100%', height: 'auto', display: 'none' }} />
    </div>
  );
};

export default App;
