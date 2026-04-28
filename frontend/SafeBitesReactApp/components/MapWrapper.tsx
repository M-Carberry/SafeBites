import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

type Restaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  route: string;
};

type MapWrapperProps = {
  latitude: number;
  longitude: number;
  restaurants?: Restaurant[];
};

export default function MapWrapper({ latitude, longitude, restaurants = [] }: MapWrapperProps) {
  const router = useRouter();

  if (Platform.OS === 'web') {
    const MapWeb = require('./MapWeb').default;
    return <MapWeb latitude={latitude} longitude={longitude} restaurants={restaurants} />;
  }

  const RNMaps = require('react-native-maps');
  const MapView = RNMaps.default;
  const { Marker } = RNMaps;

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

      {restaurants.map((r) => (
        <Marker
          key={r.id}
          coordinate={{ latitude: r.latitude, longitude: r.longitude }}
          title={r.name}
          pinColor="#6aa792"
          onCalloutPress={() => router.push(r.route as any)}
        />
      ))}
    </MapView>
  );
}