import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit from 'react-native-health';

const { Permissions } = AppleHealthKit.Constants;

const permissions = {
  permissions: {
    read: [
      Permissions.Steps,
      Permissions.FlightsClimbed,
      Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

const useHealthData = (date) => {
  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions');
        return;
      }
      setHasPermission(true);
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios' || !hasPermissions) {
      return;
    }

    const options = {
      date: new Date(date).toISOString(),
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the Flights Climbed:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the Distance:', err);
        return;
      }
      setDistance(results.value);
    });
  }, [hasPermissions, date]);

  return { steps, flights, distance };
};

export default useHealthData;