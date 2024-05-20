import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo for the back button
import * as Location from 'expo-location';
import { db } from '../config'; // Make sure this points to your Firebase config
import { ref, set, onValue } from 'firebase/database';

export default function Map({ navigation }) {
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [markers, setMarkers] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [carLocation, setCarLocation] = useState(null);
    const [showShortestPath, setShowShortestPath] = useState(false);
    const [shortestPath, setShortestPath] = useState([]);

    const mapRef = useRef(null);

    useEffect(() => {
        // Request permission and get user's current location
        userLocation();
        // Fetch car location from Firebase
        fetchCarLocation();
    }, []);

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
        setCurrentLocation(location.coords);
    };

    const fetchCarLocation = () => {
        const carLocationRef = ref(db, 'car');
        onValue(carLocationRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCarLocation({
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            }
        });
    };

    const addMarker = (coordinate) => {
        setMarkers([...markers, coordinate]);
    };

    const clearMarkers = () => {
        setMarkers([]);
        setShortestPath([]);
        setShowShortestPath(false);
    };

    const sendLocationToFirebase = () => {
        // Update current location
        const currentLocationRef = ref(db, 'locations/current');
        const currentLocationData = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            timestamp: new Date().toISOString()
        };

        // Update markers
        const markersRef = ref(db, 'locations/markers');
        const markersData = markers.map((marker, index) => ({
            [`marker${index + 1}`]: {
                latitude: marker.latitude,
                longitude: marker.longitude
            }
        }));

        const updates = {};
        updates['current'] = currentLocationData;
        updates['markers'] = Object.assign({}, ...markersData);

        set(currentLocationRef, currentLocationData)
            .then(() => {
                console.log('Current location data sent successfully:', currentLocationData);
            })
            .catch((error) => {
                console.error('Error sending current location data:', error);
            });

        set(markersRef, Object.assign({}, ...markersData))
            .then(() => {
                console.log('Markers data sent successfully:', markersData);
            })
            .catch((error) => {
                console.error('Error sending markers data:', error);
            });
    };

    const calculateShortestPath = () => {
        if (!carLocation || markers.length === 0) {
            return;
        }

        const shortestPathCoordinates = markers.reduce((acc, marker) => {
            const distance = Math.sqrt(
                Math.pow(marker.latitude - carLocation.latitude, 2) +
                Math.pow(marker.longitude - carLocation.longitude, 2)
            );
            return distance < acc.distance ? { coordinates: [carLocation, marker], distance } : acc;
        }, { coordinates: [], distance: Infinity }).coordinates;

        setShortestPath(shortestPathCoordinates);
        setShowShortestPath(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <MapView 
                ref={mapRef}
                style={styles.map} 
                region={mapRegion}
                onPress={(e) => addMarker(e.nativeEvent.coordinate)}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} coordinate={marker} title={`Marker ${index + 1}`} />
                ))}
                {currentLocation && (
                    <Marker coordinate={currentLocation} pinColor="blue" title="Current Location" />
                )}
                {carLocation && (
                    <Marker coordinate={carLocation} pinColor="yellow" title="Car Location" />
                )}
                {showShortestPath && (
                    <Polyline
                        coordinates={shortestPath}
                        strokeColor="green"
                        strokeWidth={3}
                    />
                )}
            </MapView>
            <ScrollView style={styles.infoContainer}>
                {currentLocation && (
                    <Text style={styles.text}>Controller Location: {currentLocation.latitude}, {currentLocation.longitude}</Text>
                )}
                {carLocation && (
                    <Text style={styles.text}>Car Location: {carLocation.latitude}, {carLocation.longitude}</Text>
                )}
                <Text style={styles.text}>Markers:</Text>
                {markers.map((marker, index) => (
                    <Text key={index} style={styles.text}>{`Marker ${index + 1}: ${marker.latitude}, ${marker.longitude}`}</Text>
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={sendLocationToFirebase}>
                    <Text style={styles.buttonText}>Send Location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={clearMarkers}>
                    <Text style={styles.buttonText}>Clear Location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={calculateShortestPath}>
                    <Text style={styles.buttonText}>Go to Markers</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 3,
    },
    infoContainer: {
        flex: 1,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20, // Adjusted margin for increased spacing
    },
    backButton: {
        position: 'absolute',
        top: 35,
        left: 20,
        zIndex: 1,
    },
    text: {
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        borderRadius: 10,
   // Adjusted horizontal margin for spacing between buttons
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        padding: 5,
    },
});
