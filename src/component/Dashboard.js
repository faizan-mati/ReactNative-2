// Screen2.js

import React from 'react';
import { View, Text, Button } from 'react-native';

const Dashboard = ({ navigation }) => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dashboar</Text>
      <Button
        title="Go back to PickUp"
        onPress={() => navigation.navigate('PickUp')}
      />
    </View>
  );
};

export default Dashboard;





// fsq3Illlc6ynu/oJgI9xYZmIRv3L1DumIyQm4RhYcVoHg2E=