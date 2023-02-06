/* global google */
import './Main.scss';

import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, useLoadScript as wtf } from '@react-google-maps/api';

import {
  GoogleMapX,
  useLoadScript as wtfX
} from '@react-google-maps/api';

import MAP_STYLES from '../util/map-styles';
import { setMap } from '../util/map-instance';
import SECRETS from '../secrets.json';

import ActivePoint from './ActivePoint';
import DirectionsView from './DirectionsView';
import RouteLayer from './RouteLayer';
import ShopView from './ShopView';
import StopMarkerLayer from './StopMarkerLayer';

const LIBRARIES = ['geometry', 'drawing', 'places'];

function valueOfPoint (point) {
  if (!point) { return ''; }
  let { lat, lng } = point;

  return `${lat},${lng}`;
}

const DEFAULT_MAP_PROPS = {
  zoom: 12,
  center: {
    lat: 34.0407,
    lng: -118.2468
  }
};

const DEFAULT_MAP_OPTIONS = {
  styles: MAP_STYLES,
  mapTypeControl: false
};

function Main ({ loadingElement }) {
  let mapRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: SECRETS.googleMapsApiKey,
    libraries: LIBRARIES,
    version: '3.exp'
  });
  if (loadError) {
    console.error(`ERROR:`, loadError);
  }
  const {
    point: activePoint,
    shops: activePointShops,
    shopDirections: activePointShopDirections,
    stopDirections: activePointStopDirections,
    walkscore: activePointWalkscore,
    hoveredShop
  } = useSelector(state => state.activePoint);

  const onLoad = useCallback(map => {
    setMap(map);
    mapRef.current = map;
  }, []);

  // When walking directions come in, move the map to accommodate the origin
  // and each destination.
  useEffect(() => {
    let { current: map } = mapRef;
    if (activePointStopDirections === null) { return; }
    let points = [];
    const addPoint = p => {
      points.push( new google.maps.LatLng(p.location.toJSON()) );
    };
    activePointStopDirections.forEach(({ request: d }, index) => {
      if (index === 0) { addPoint(d.origin); }
      addPoint(d.destination);
    });

    let bounds = new google.maps.LatLngBounds();
    points.forEach(p => bounds.extend(p));

    map.fitBounds(bounds);
  }, [activePointStopDirections]);

  let shopsViews = null;
  if (activePointShops) {
    shopsViews = activePointShops.map(shop => {
      let isHovered = shop.place_id === hoveredShop;
      return (
        <ShopView
          key={shop.place_id}
          isHovered={isHovered}
          shop={shop} />
      );
    });
  }

  let activePointView = null;
  if (activePoint) {
    activePointView = (
      <ActivePoint
        key={valueOfPoint(activePoint.position)}
        point={activePoint}
        shopDirections={activePointShopDirections}
        stopDirections={activePointStopDirections}
        shops={activePointShops}
        walkscore={activePointWalkscore} />
    );
  }

  let { zoom, center } = DEFAULT_MAP_PROPS;
  if (!isLoaded) {
    return (
      <div className="Main__loading">Loading...</div>
    );
  }
  return (
    <GoogleMap
      clickableIcons={false}
      extraMapTypes={[]}
      mapContainerClassName="Main__map"
      onLoad={onLoad}
      zoom={zoom}
      center={center}
      options={DEFAULT_MAP_OPTIONS}>
      <StopMarkerLayer />
      <RouteLayer />
      {shopsViews}
      {activePointView}
      <DirectionsView directions={activePointStopDirections} />
    </GoogleMap>
  );

}

export default Main;
