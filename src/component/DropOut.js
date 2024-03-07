import { Button, Text } from 'react-native-elements';
// Import necessary modules
import { View, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Create and export the DropOut component
export default function DropOut({navigation, route }) {
    const { pickup } = route.params;

    const [location, setLocation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [dropOut, setDropOut] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const onPlace = (item) => {
        setDropOut(item)
    }


    useEffect(() => {
        let isMounted = true;

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const locationSubscription = Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5, // in meters
                    timeInterval: 1000, // in milliseconds
                },
                (location) => {
                    if (isMounted) {
                        setLocation(location);
                    }
                }
            );

            return () => {
                isMounted = false;
                if (locationSubscription) {
                    locationSubscription.remove();
                }
            };
        })();

        // Clean-up function
        return () => {
            isMounted = false;
        };
    }, []);

    const searchPlace = (text) => {
        setSearchText(text);

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'fsq3Illlc6ynu/oJgI9xYZmIRv3L1DumIyQm4RhYcVoHg2E='
            }
        };

        if (location) {
            fetch(`https://api.foursquare.com/v3/places/search?query=${text}&ll=${location.coords.latitude},${location.coords.longitude}&radius=3000`, options)
                .then(response => response.json())
                .then(response => {
                    setSearchResults(response.results);
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text>Pickup Location:</Text>
                <Text>{pickup.name}</Text>
                <Text>{pickup.location.formatted_address}</Text>

                <TextInput
                    style={styles.input}
                    placeholder='Search place'
                    onChangeText={searchPlace}
                    value={searchText}
                />
                {searchResults.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => onPlace(item)}>
                        <Text>{item.name}</Text>
                        <Text>{item.location.formatted_address}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {location && (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    // onLayout={() => setMapReady(true)}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="Your Location"
                            description="You are here"
                        />
                    </MapView>
                </View>
            )}
            <Button
                title="Go to DropOut"
                onPress={() => navigation.navigate('CarSelect', { pickup: pickup , dropOut: dropOut })}
            />
        </View>
    );
}

// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    mapContainer: {
        flex: 1,
        height: '80%',
        width: '100%',
    },
    map: {
        flex: 1,
    },
});
