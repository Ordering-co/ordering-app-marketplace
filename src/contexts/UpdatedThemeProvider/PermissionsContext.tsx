import { isLocalSimulatorMode } from '../../onboarding/ios-local-mode';
import React, { useState, useEffect, createContext } from 'react';
import { Platform } from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

type PermissionsContextProps = {
  notificationsPermissions: any;
  askNotificationsPermission: () => void;
  trackingStatus: string | null;
};

export const PermissionsContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider = ({ children }: any) => {
  const [notificationsPermissions, setNotificationsPermissions] = useState({});
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);

  const askNotificationsPermission = async () => {
    if (isLocalSimulatorMode()) return;
    checkNotifications().then(({ status }) => {
      if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
        requestNotifications(['alert']).then(({ status }) => {
          setNotificationsPermissions(status);
        });
      } else {
        setNotificationsPermissions(status);
      }
    });
  };

  const requestTrackingPermission = async () => {
    if (isLocalSimulatorMode()) return;
    if (Platform.OS !== 'ios') return;

    try {
      const status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (status === RESULTS.DENIED) {
        const requestResult = await request(
          PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
        );
        setTrackingStatus(requestResult);
      } else {
        setTrackingStatus(status);
      }
    } catch (error) {
      console.log('ATT permission error:', error);
    }
  };

  useEffect(() => {
    requestTrackingPermission();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        notificationsPermissions,
        askNotificationsPermission,
        trackingStatus,
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};
