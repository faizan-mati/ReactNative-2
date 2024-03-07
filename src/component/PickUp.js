import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';

const PickUp = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [pickUp, setPickUp] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [mapReady, setMapReady] = useState(false);

    const onPlace = (item) => {
        setPickUp(item)
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

        fetch(`https://api.foursquare.com/v3/places/search?query=${text}&ll=${location.coords.latitude},${location.coords.longitude}&radius=3000`, options)
            .then(response => response.json())
            .then(response => {
                setSearchResults(response.results);
            })
            .catch(err => console.error(err));
    };
    // console.log("search results", searchResults);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Search place'
                    onChangeText={searchPlace}
                    value={searchText}
                />
                {searchResults.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity onPress={() => onPlace(item)}>
                            <Text>{item.name}</Text>
                            <Text>{item.location.formatted_address}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.mapContainer}>
                {location && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        onLayout={() => setMapReady(true)} // Set mapReady to true when the layout is complete
                    >
                        {mapReady && (
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title="Your Location"
                                description="You are here"
                            />
                        )}
                    </MapView>
                )}
                <Button
                    title="Go to DropOut"
                    onPress={() => navigation.navigate('DropOut', { pickup: pickUp })}
                />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    inputContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    mapContainer: {
        position: 'absolute',
        top: 40, // Adjust this value to set the distance between input and map
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default PickUp;
