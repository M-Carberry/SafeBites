import { Platform } from 'react-native';

export default function MapWrapper({ latitude, longitude }: { latitude: number, longitude: number }) {
  if (Platform.OS === 'web') {
    const MapWeb = require('./MapWeb').default;
    return <MapWeb latitude={latitude} longitude={longitude} />;
  }

  const RNMaps = require('react-native-maps');
  const MapView = RNMaps.default;
  const Marker = RNMaps.Marker;

  return (
    <MapView
      style={{ flex: 1 }}
      showsUserLocation={true}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title="You are here!"
      />
    </MapView>
  );
}