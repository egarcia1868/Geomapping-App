import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {LocationService} from '../services/LocationService';
import {TagService} from '../services/TagService';
import {UserLocation, Tag} from '../types';
import {TagCreationModal} from '../components/TagCreationModal';

export const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapView>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    initializeLocation();
    loadTags();

    return () => {
      if (watchId.current !== null) {
        LocationService.clearWatch(watchId.current);
      }
    };
  }, []);

  const initializeLocation = async () => {
    try {
      const hasPermission = await LocationService.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Location permission is required to use this app',
        );
        return;
      }

      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);

      watchId.current = LocationService.watchLocation(
        (newLocation) => {
          setUserLocation(newLocation);
          loadTags();
        },
        (error) => {
          console.error('Location watch error:', error);
        },
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location');
    }
  };

  const loadTags = async () => {
    if (!userLocation) return;
    
    try {
      const nearbyTags = await TagService.getTagsWithinRadius(userLocation, 50);
      setTags(nearbyTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleMapPress = (event: any) => {
    const {coordinate} = event.nativeEvent;
    
    if (!userLocation) {
      Alert.alert('Error', 'Your location is not available');
      return;
    }

    const isValid = TagService.validateTagLocation(userLocation, coordinate);
    if (!isValid) {
      Alert.alert(
        'Location Too Far',
        'You can only create tags within 0.5 miles of your current location',
      );
      return;
    }

    setSelectedLocation(coordinate);
    setIsTagModalVisible(true);
  };

  const handleTagCreated = async (title: string, description: string) => {
    if (!selectedLocation || !userLocation) return;

    try {
      const newTag = await TagService.addTag({
        location: selectedLocation,
        title,
        description,
        createdBy: 'user',
      });

      setTags(prevTags => [...prevTags, newTag]);
      setIsTagModalVisible(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error creating tag:', error);
      Alert.alert('Error', 'Could not create tag');
    }
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={handleMapPress}>
        
        <Circle
          center={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          radius={804.672} // 0.5 miles in meters
          strokeColor="rgba(0, 150, 255, 0.5)"
          fillColor="rgba(0, 150, 255, 0.1)"
        />

        {tags.map(tag => (
          <Marker
            key={tag.id}
            coordinate={tag.location}
            title={tag.title}
            description={tag.description}
          />
        ))}
      </MapView>

      <TagCreationModal
        visible={isTagModalVisible}
        onClose={() => {
          setIsTagModalVisible(false);
          setSelectedLocation(null);
        }}
        onSubmit={handleTagCreated}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Tap within the blue circle to create a tag
        </Text>
        <Text style={styles.infoText}>
          Tags: {tags.length} within 50 miles
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});