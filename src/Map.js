import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../config';
import { ref, push,set } from 'firebase/database';

export default function Map() {
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [markers, setMarkers] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        // Request permission and get user's current location
        userLocation();
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

    const addMarker = (coordinate) => {
        setMarkers([...markers, coordinate]);
    };

    const clearMarkers = () => {
        setMarkers([]);
    };
    const sendLocationToFirebase = () => {
        const locationRef = ref(db, 'locations/current');
        const data = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            timestamp: new Date().toISOString()
        };
    
        set(locationRef, data)
            .then(() => {
                console.log('Location data sent successfully:', data);
            })
            .catch((error) => {
                console.error('Error sending location data:', error);
            });
    };

    return (
        <View style={styles.container}>
            <MapView 
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
            </MapView>
            <View style={styles.infoContainer}>
                {currentLocation && (
                    <Text>Current Location: {currentLocation.latitude}, {currentLocation.longitude}</Text>
                )}
                <Text>Markers:</Text>
                {markers.map((marker, index) => (
                    <Text key={index}>{`Marker ${index + 1}: ${marker.latitude}, ${marker.longitude}`}</Text>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Send Location" onPress={sendLocationToFirebase} />
                <Button title="Clear Location" onPress={clearMarkers} />
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
        marginVertical: 10,
    },
});
