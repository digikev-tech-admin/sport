'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Libraries,
  Autocomplete,
  Marker,
} from '@react-google-maps/api';
import ButtonLoader from './shared/ButtonLoader';

const libraries: Libraries = ['places']; // Required for autocomplete

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 40.7128, // Default: New York City
  lng: -74.0060,
};

type PlaceValue = {
  address: string;
  title?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

interface LocationMapProps {
  value?: PlaceValue;
  onChange?: (value: PlaceValue) => void;
  country?: string | string[]; // e.g. 'us' or ['us','ca']
  height?: number; // override map height
  initialCenter?: { lat: number; lng: number };
}

export default function LocationMap({
  value,
  onChange,
  country = 'gb',
  height,
  initialCenter,
}: LocationMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>(value?.address || '');
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    value?.lat && value?.lng ? { lat: value.lat, lng: value.lng } : null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const onLoad = React.useCallback(function callback(mapInstance: google.maps.Map) {
    const start = markerPosition || initialCenter || defaultCenter;
    const bounds = new window.google.maps.LatLngBounds(start);
    mapInstance.fitBounds(bounds);
    setMap(mapInstance);
  }, [markerPosition, initialCenter]);

  const parseAddressComponents = (
    components: google.maps.GeocoderAddressComponent[] | undefined
  ) => {
    const result: Partial<PlaceValue> = {};
    if (!components) return result;
    
    for (const c of components) {
      // Extract title from premise (e.g., "Shankar Bazar")
      if (c.types.includes('premise')) {
        result.title = c.long_name;
      }
      // Extract address1 from route (e.g., "Rajapur Road")
      if (c.types.includes('route')) {
        result.address1 = c.long_name;
      }
      // Extract address2 from neighborhood (e.g., "Talib City")
      if (c.types.includes('neighborhood') || c.types.includes('postal_town')) {
        result.address2 = c.long_name;
      }
      // Extract city from locality
      if (c.types.includes('locality') || c.types.includes('postal_town')) {
        result.city = c.long_name;
      }
      // Extract state from administrative_area_level_1
      if (c.types.includes('administrative_area_level_1')) {
        result.state = c.long_name;
      }
      // Extract zipCode from postal_code
      if (c.types.includes('postal_code')) {
        result.zipCode = c.long_name;
      }
      // Extract country
      if (c.types.includes('country')) {
        result.country = c.long_name;
      }
    }
    return result;
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.log('No details available for input: ' + place.name);
        return;
      }

      console.log("place",place);
      
      
      // Parse address components to extract structured data
      const parsed = parseAddressComponents(place.address_components || undefined);
      
      // Store the full original address (including plus codes)
      const fullAddress = place.formatted_address || '';
      
      setSelectedAddress(fullAddress);
      setIsManualInput(false); // Reset manual input flag when place is selected
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPosition(coords);
      
      // Update map center to selected location
      if (map) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
      }
      
      // Create the structured value with parsed components
      const nextValue: PlaceValue = {
        address: fullAddress, // Store full address including plus codes
        title: place?.name || parsed.title,
        address1: parsed.address1,
        address2: parsed.address2,
        city: parsed.city,
        state: parsed.state,
        zipCode: parsed.zipCode,
        country: parsed.country,
        lat: coords.lat,
        lng: coords.lng,
      };
      
      if (onChange) onChange(nextValue);
      console.log('Parsed address components:', parsed);
      console.log('Final structured value:', nextValue);
    }
  };


  useEffect(() => {
    if (!isManualInput) {
      setSelectedAddress(value?.address || '');
      setMarkerPosition(
        value?.lat && value?.lng ? { lat: value.lat, lng: value.lng } : null
      );
    }
  }, [value, isManualInput]);

  const onAutocompleteLoad = React.useCallback(function callback(autoCompleteInstance: google.maps.places.Autocomplete) {
    setAutocomplete(autoCompleteInstance);
  }, []);

  if (!isLoaded) {
    return <ButtonLoader text="Loading map..." />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country }} // Optional: Restrict to a country or list
        >
          <input
            ref={inputRef}
            type="text"
            value={selectedAddress}
            onChange={(e) => {
              setSelectedAddress(e.target.value);
              setIsManualInput(true);
            }}
            placeholder="Enter an address..."
            className="w-full p-2 border border-gray-300 rounded"
            style={{ width: '100%' }}
          />
        </Autocomplete>
        {selectedAddress && (
          <p className="mt-2 text-sm text-gray-600">Selected: {selectedAddress}</p>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, ...(height ? { height: `${height}px` } : {}) }}
        center={markerPosition || initialCenter || defaultCenter}
        zoom={10}
        onLoad={onLoad}
        options={{
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
        }}
      >
        {markerPosition && (
          <Marker position={markerPosition} />
        )}
      </GoogleMap>
    </div>
  );
}