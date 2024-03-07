import { Text } from 'react-native-elements'
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

export default function CarSelect({ navigation, route }) {
    const { pickup, dropOut } = route.params;
    console.log("location", dropOut);
    
    return (
        <View>
            <Text>Pickup Location:</Text>
            <Text>{pickup.name}</Text>
            <Text>{pickup.location.formatted_address}</Text>
            
            <Text>DropOut Location:</Text>
            <Text>{dropOut.name}</Text>
            <Text>{dropOut.location.formatted_address}</Text>
            
            <Button title="Bike" />
            <Button title="Car" />
        </View>
    );
}
