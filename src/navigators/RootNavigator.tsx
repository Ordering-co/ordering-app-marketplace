import { isLocalSimulatorMode } from '../onboarding/ios-local-mode';
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Alert as NativeAlert, BackHandler, Linking, DeviceEventEmitter, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check'
import { createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import OneSignal from 'react-native-onesignal';
import {
  getMessaging,
  getToken,
  deleteToken,
  getInitialNotification,
  onNotificationOpenedApp,
  onMessage,
  onTokenRefresh
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { requestNotifications } from 'react-native-permissions';
import NetInfo from '@react-native-community/netinfo'
import SplashScreen from 'react-native-splash-screen';

import { useOrder, useSession, useConfig, useApi, useWebsocket, useLanguage } from '@components';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import * as RootNavigation from '../navigators/NavigationRef';
import settings from '../config.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import IntroductoryTutorial from '../pages/IntroductoryTutorial';
import HomeNavigator from './HomeNavigator';
import NetworkError from '../pages/NetworkError';
import ProjectForm from '../pages/ProjectForm'
import UserVerification from '../pages/UserVerification';
import CompleteProfile from '../pages/CompleteProfile';

import { _retrieveStoreData, _setStoreData, _removeStoreData } from '@ui';
import { useProfileCompletion } from '../contexts/CheckoutFieldsContext';
import {
  findNotificationTokenId,
  getNotificationTokensUrl,
  shouldPromptForPushNotifications,
  shouldSetupOneSignal,
  shouldTeardownOneSignal
} from './oneSignalConsent';
import {
  isFirebasePushEnabled,
  shouldSetupFirebasePush,
  shouldTeardownFirebasePush
} from './firebasePushConsent';
import { getPushOpenNotificationPlan } from './getPushOpenNotificationPlan';
import { subscribeUpdateOrderVibration } from './subscribeUpdateOrderVibration';
import { getMyAccountDeepLinkNavigateArgs } from './getHomeDeepLinkPlan';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const [{ auth, user, loading: sessionLoading, token }] = useSession();
  const [orderStatus, { changeMoment }] = useOrder();
  const [ordering] = useApi()
  const socket = useWebsocket()
  const [{ configs, loading: configsLoading }] = useConfig();
  const [, t] = useLanguage()
  const { hasConsented } = useCookieConsent()
  const [loaded, setLoaded] = useState(false);
  const [productLogin, setProductLogin] = useState<any>({});
  const [orderIdParam, setOrderIdParam] = useState(null)
  const [cartUuidParam, setCartUuidParam] = useState(null)
  const [storeParam, setStoreParam] = useState(null)
  const [productParam, setProductParam] = useState<any>(null)
  const [pendingNotification, setPendingNotification] = useState<any>(null)
  const [generalProjectState, setGeneralProjectState] = useState<{ changed: boolean, setted: boolean }>({ changed: false, setted: false })
  const [oneSignalState, setOneSignalState] = useState<any>({
    notification_app: settings.notification_app,
  });
  const oneSignalSetupGenerationRef = useRef(0)
  const didSetupOneSignalRef = useRef(false)
  const oneSignalSetupInFlightRef = useRef(false)
  const firebaseSetupGenerationRef = useRef(0)
  const didSetupFirebaseRef = useRef(false)
  const firebaseSetupInFlightRef = useRef(false)
  const firebaseUnsubscribersRef = useRef<Array<() => void>>([])
  const notificationTokenRef = useRef<any>(null)
  const showTutorials = settings.show_tutorials;
  const [isTutorial, setTutorial] = useState([true, 1, '1'].includes(showTutorials as any));
  const [tutorialReady, setTutorialReady] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState({ loading: true });
  const [connectionState, setConnectionState] = useState<{
    connection_status: boolean;
  } | null>(null);
  const [appState, setAppState] = useState(AppState.currentState)

  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified
  const isUserVerifyRequired = isEmailVerifyRequired || isPhoneVerifyRequired
  const isGuest = user?.guest_id
  const isEnableAppVersionCheck = configs?.app_version?.value === '1'
  const { isRequired: isProfileCompletionRequired } = useProfileCompletion();


  const validDate = (date: any) => {
    if (!date) {
      return;
    }
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm');
    return _date;
  };

  const oneSignalSetup = async () => {
    if (isLocalSimulatorMode()) {
      setIsPushLoading({ loading: false });
      return;
    }
    const generation = ++oneSignalSetupGenerationRef.current
    oneSignalSetupInFlightRef.current = true
    setIsPushLoading({ loading: true });
    const data = {
      appId: configs?.onesignal_orderingapp_id?.value,
      externalId: `${ordering?.project}-${user?.id}`,
      email: user?.email,
      cellphone: user?.cellphone
        ? user?.country_phone_code
          ? `+${user?.country_phone_code} ${user?.cellphone}`
          : user?.cellphone
        : ''
    }
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(data.appId);
    OneSignal.disablePush(false);

    try {
      if (data.email) {
        OneSignal.setEmail(data.email);
      }

      if (data.cellphone) {
        OneSignal.setSMSNumber(data.cellphone);
      }

      if (data.externalId) {
        OneSignal.setExternalUserId(data.externalId);
      }
    } catch (error) {
      console.log('OneSignal setup error:', error);
    }

    const deviceState: any = await OneSignal.getDeviceState();
    if (generation !== oneSignalSetupGenerationRef.current) {
      oneSignalSetupInFlightRef.current = false
      return;
    }

    if (shouldPromptForPushNotifications(deviceState)) {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('Prompt response:', response);
      });
    }

    setOneSignalState({
      ...oneSignalState,
      notification_token: deviceState?.userId,
    });
    notificationTokenRef.current = deviceState?.userId

    if (deviceState?.userId) {
      _setStoreData('notification_state', {
        ...oneSignalState,
        notification_token: deviceState?.userId,
      });
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      setPendingNotification(notification)
    });

    OneSignal.addSubscriptionObserver((event: any) => {
      if (!didSetupOneSignalRef.current) {
        return
      }
      setOneSignalState({
        ...oneSignalState,
        notification_token: event?.to?.userId,
      });
      notificationTokenRef.current = event?.to?.userId
      if (!event?.to?.isSubscribed) {
        OneSignal.addTrigger('prompt_ios', 'true');
      }
    });

    didSetupOneSignalRef.current = true
    oneSignalSetupInFlightRef.current = false
    setIsPushLoading({ loading: false });
  };

  const oneSignalTeardown = async () => {
    if (isLocalSimulatorMode()) {
      setIsPushLoading({ loading: false });
      return;
    }
    oneSignalSetupGenerationRef.current += 1
    didSetupOneSignalRef.current = false
    oneSignalSetupInFlightRef.current = false
    try {
      OneSignal.disablePush(true)
      OneSignal.removeExternalUserId()
    } catch (error) {
      console.log('OneSignal teardown error:', error)
    }

    const playerId = notificationTokenRef.current || oneSignalState.notification_token
    const tokensUrl = getNotificationTokensUrl(ordering.root, user?.id)
    if (token && playerId && tokensUrl) {
      try {
        const response = await fetch(tokensUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const content = await response.json()
        const tokenId = findNotificationTokenId(content, playerId)
        if (tokenId != null) {
          await fetch(`${tokensUrl}/${tokenId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
        }
      } catch (error) {
        console.log('OneSignal token unsubscribe error:', error)
      }
    }

    notificationTokenRef.current = null
    setOneSignalState({
      notification_app: settings.notification_app
    })
    _removeStoreData('notification_state')
    setIsPushLoading({ loading: false })
  };

  const firebasePushSetup = async () => {
    if (isLocalSimulatorMode()) {
      setIsPushLoading({ loading: false });
      return;
    }
    const generation = ++firebaseSetupGenerationRef.current
    firebaseSetupInFlightRef.current = true
    setIsPushLoading({ loading: true });
    const messaging = getMessaging()

    requestNotifications(['alert', 'sound', 'badge']).catch((error) => {
      console.log('Firebase push permission error:', error)
    })

    let fcmToken: string | null = null
    try {
      fcmToken = await getToken(messaging)
    } catch (error) {
      console.log('Firebase push token error:', error)
    }

    if (generation !== firebaseSetupGenerationRef.current) {
      firebaseSetupInFlightRef.current = false
      return;
    }

    const nextState = {
      ...oneSignalState,
      notification_token: fcmToken,
      notification_provider: 'fcm'
    }
    setOneSignalState(nextState);
    notificationTokenRef.current = fcmToken

    if (fcmToken) {
      _setStoreData('notification_state', nextState);
    }

    if (Platform.OS === 'android') {
      try {
        await notifee.createChannel({
          id: 'orders',
          name: 'Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default'
        })
      } catch (error) {
        console.log('Firebase push channel error:', error)
      }
    }

    firebaseUnsubscribersRef.current.push(
      onNotificationOpenedApp(messaging, (remoteMessage: any) => {
        setPendingNotification(remoteMessage)
      }),
      onMessage(messaging, async (remoteMessage: any) => {
        if (Platform.OS !== 'android' || !remoteMessage?.notification) {
          return
        }
        try {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: remoteMessage.data || {},
            android: {
              channelId: 'orders',
              smallIcon: 'ic_launcher',
              pressAction: { id: 'default' },
              sound: 'default'
            }
          })
        } catch (error) {
          console.log('Firebase foreground display error:', error)
        }
      }),
      notifee.onForegroundEvent(({ type, detail }: any) => {
        if (type === EventType.PRESS) {
          setPendingNotification({ data: detail?.notification?.data })
        }
      }),
      onTokenRefresh(messaging, (newToken: string) => {
        if (!didSetupFirebaseRef.current) {
          return
        }
        const refreshedState = {
          ...oneSignalState,
          notification_token: newToken,
          notification_provider: 'fcm'
        }
        setOneSignalState(refreshedState);
        notificationTokenRef.current = newToken
        _setStoreData('notification_state', refreshedState);
      })
    )

    getInitialNotification(messaging)
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          setPendingNotification(remoteMessage)
        }
      })
      .catch((error: any) => {
        console.log('Firebase initial notification error:', error)
      })

    didSetupFirebaseRef.current = true
    firebaseSetupInFlightRef.current = false
    setIsPushLoading({ loading: false });
  };

  const firebasePushTeardown = async () => {
    if (isLocalSimulatorMode()) {
      setIsPushLoading({ loading: false });
      return;
    }
    firebaseSetupGenerationRef.current += 1
    didSetupFirebaseRef.current = false
    firebaseSetupInFlightRef.current = false
    firebaseUnsubscribersRef.current.forEach(unsubscribe => {
      try {
        unsubscribe()
      } catch (error) {
        console.log('Firebase push unsubscribe error:', error)
      }
    })
    firebaseUnsubscribersRef.current = []

    const fcmToken = notificationTokenRef.current || oneSignalState.notification_token
    const tokensUrl = getNotificationTokensUrl(ordering.root, user?.id)
    if (token && fcmToken && tokensUrl) {
      try {
        const response = await fetch(tokensUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const content = await response.json()
        const tokenId = findNotificationTokenId(content, fcmToken)
        if (tokenId != null) {
          await fetch(`${tokensUrl}/${tokenId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
        }
      } catch (error) {
        console.log('Firebase token unsubscribe error:', error)
      }
    }

    try {
      await deleteToken(getMessaging())
    } catch (error) {
      console.log('Firebase push teardown error:', error)
    }

    notificationTokenRef.current = null
    setOneSignalState({
      notification_app: settings.notification_app
    })
    _removeStoreData('notification_state')
    setIsPushLoading({ loading: false })
  };

  useEffect(() => {
    if (!loaded && !orderStatus.loading && !isPushLoading.loading) {
      setLoaded(true);
    }
  }, [orderStatus, isPushLoading]);

  useEffect(() => {
    const setTutorialLocal = async () => {
      const data = await _retrieveStoreData('isTutorial');
      if (data === false) {
        setTutorial(false);
      }
      setTutorialReady(true);
    };
    setTutorialLocal();
  }, []);

  useEffect(() => {
    if (!sessionLoading && !isPushLoading.loading && !auth) {
      setLoaded(!auth);
    }
  }, [sessionLoading, isPushLoading]);

  useEffect(() => {
    const plan = getPushOpenNotificationPlan({
      loaded,
      auth,
      isProfileCompletionRequired,
      isUserVerifyRequired,
      isGuest,
      notification: pendingNotification
    })
    if (!plan.shouldOpen || !plan.screen) {
      return
    }
    RootNavigation.navigate(plan.screen, plan.params)
    setPendingNotification(null)
  }, [loaded, auth, pendingNotification, isProfileCompletionRequired, isUserVerifyRequired, isGuest]);

  useEffect(() => {
    const _currentDate = dayjs
      .utc(validDate(orderStatus.options?.moment))
      .local();
    if (!_currentDate) {
      return;
    }
    const selected = dayjs(_currentDate, 'YYYY-MM-DD HH:mm');
    const now = dayjs();
    const secondsDiff = selected.diff(now, 'seconds');
    const checkTime = setTimeout(() => {
      changeMoment(null);
    }, secondsDiff * 1000);

    return () => {
      clearTimeout(checkTime);
    };
  }, [orderStatus.options?.moment]);

  useEffect(() => {
    if (isLocalSimulatorMode()) {
      setIsPushLoading({ loading: false });
      return;
    }
    const firebaseEnabled = isFirebasePushEnabled(configs)
    const firebaseGate = {
      configsLoading,
      enabled: firebaseEnabled,
      auth,
      hasConsented
    }
    const oneSignalGate = {
      configsLoading,
      appId: firebaseEnabled ? null : configs?.onesignal_orderingapp_id?.value,
      auth,
      hasConsented
    }
    if (shouldSetupFirebasePush(firebaseGate)) {
      if (didSetupOneSignalRef.current || oneSignalSetupInFlightRef.current) {
        oneSignalTeardown()
      }
      firebasePushSetup();
      return
    }
    if (shouldTeardownFirebasePush(firebaseGate) && (didSetupFirebaseRef.current || firebaseSetupInFlightRef.current)) {
      firebasePushTeardown()
    }
    if (shouldSetupOneSignal(oneSignalGate)) {
      oneSignalSetup();
      return
    }
    if (shouldTeardownOneSignal(oneSignalGate)) {
      setIsPushLoading({ loading: false });
      if (didSetupOneSignalRef.current || oneSignalSetupInFlightRef.current) {
        oneSignalTeardown()
      }
    }
  }, [configsLoading, configs?.onesignal_orderingapp_id?.value, configs?.firebase_push_enabled?.value, auth, hasConsented]);

  const subscribePushNotifications = async () => {
    if (isLocalSimulatorMode()) {
      setIsPushLoading({ loading: false });
      return;
    }
    setIsPushLoading({ loading: true });
    try {
      const url = `${ordering.root}/users/${user.id}/notification_tokens`
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          token: oneSignalState.notification_token,
          user_id: user.id,
          app: oneSignalState.notification_app,
          ...(oneSignalState.notification_provider
            ? { provider: oneSignalState.notification_provider }
            : {})
        })
      })
      setIsPushLoading({ loading: false });
    } catch (err) {
      setIsPushLoading({ loading: false });
    }
  }

  useEffect(() => {
    if (auth && hasConsented && oneSignalState.notification_token) {
      subscribePushNotifications()
    }
  }, [oneSignalState.notification_token, auth, hasConsented]);

  let netInfoSuscription: any = null
  useEffect(() => {
    netInfoSuscription = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      netInfoSuscription && netInfoSuscription()
    }
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionState({ connection_status: state.isConnected });
  };

  useEffect(() => {
    if (!orderStatus.loading) {
      const getCountryCode = async () => {
        const data = await _retrieveStoreData('country-code');
        const localCountryCode = orderStatus?.options?.address?.country_code ?? data

        if (localCountryCode) {
          ordering?.setCountryCode(localCountryCode)
        }
      }

      getCountryCode()
    }
  }, [orderStatus])

  useEffect(() => {
    if (!token) return
    return subscribeUpdateOrderVibration(socket)
  }, [socket, user, token])

  useEffect(() => {
    const appStateListener: any = AppState.addEventListener(
      'change',
      nextAppState => { setAppState(nextAppState) },
    );
    return () => {
      appStateListener?.remove();
    };
  }, [])

  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded?.isNeeded) {
        NativeAlert.alert(
          t('PLEASE_UPDATE', 'Please update'),
          t('APP_UPDATE_MESSAGE', 'You will have to update your app to the latest version to continue using.'),
          [
            {
              text: t('UPDATE', 'Update'),
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl)
              }
            }
          ],
          {
            cancelable: true
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (isEnableAppVersionCheck && appState === 'active') {
      checkUpdateNeeded();
    }
  }, [appState, isEnableAppVersionCheck])

  React.useEffect(() => {
    if (RootNavigation?.navigationRef?.current?.getState) {
      const params = RootNavigation?.navigationRef?.current?.getState()
      const myAccountRoute = params?.routes?.find((route: any) => route.name === 'MyAccount')
      if (myAccountRoute?.state?.routes?.length > 0) {
        myAccountRoute?.state?.routes?.map((route: any) => {
          if (route.params?.orderId) {
            setOrderIdParam(route.params?.orderId)
          }
          if (route.params?.cartUuid) {
            setCartUuidParam(route.params?.cartUuid)
          }
          if (route.params?.store) {
            setStoreParam(route.params?.store)
          }
          if (route.params?.productId && route.params?.categoryId) {
            setProductParam(
              {
                categoryId: route?.params?.categoryId,
                businessId: route?.params?.store,
                productId: route?.params?.productId
              }
            )
          }
        })
      }
    }
    return () => {
      setOrderIdParam(null)
      setCartUuidParam(null)
      setStoreParam(null)
      setProductParam(null)
    }
  }, [RootNavigation?.navigationRef?.current, auth, loaded])

  useEffect(() => {
    const navigateArgs = getMyAccountDeepLinkNavigateArgs({
      orderIdParam,
      cartUuidParam,
      storeParam,
      productParam
    })
    if (!loaded || !navigateArgs) return
    RootNavigation.navigationRef.current?.navigate(navigateArgs)
  }, [loaded, auth, orderIdParam, cartUuidParam, storeParam, productParam])

  useEffect(() => {
    const getProjectName = async () => {
      const data = await _retrieveStoreData('project_name');
      if (data) {
        setGeneralProjectState((prevState) => ({ ...prevState, setted: true }))
      }
    }
    getProjectName()
  }, [ordering.project])

  useEffect(() => {
    DeviceEventEmitter.addListener('change_project', (newState: any) => {
      setGeneralProjectState(() => newState)
    })
    return () => {
      DeviceEventEmitter.removeAllListeners('change_project')
    }
  }, [])

  const HomeScreen = { component: Home, name: 'Home' }
  const ProjectScreen = { component: ProjectForm, name: 'ProjectForm' }

  const initialScreens = settings?.use_root_point
    ? generalProjectState.setted
      ? [HomeScreen, ProjectScreen]
      : [ProjectScreen, HomeScreen]
    : [HomeScreen]

  useEffect(() => {
    if (loaded && tutorialReady) {
      SplashScreen.hide();
    }
  }, [loaded, tutorialReady]);

  if (!tutorialReady) return null;

  const navigatorMode = isProfileCompletionRequired
    ? 'CompleteProfile'
    : isUserVerifyRequired && !isGuest
      ? 'UserVerification'
      : 'MyAccount';

  const initialRouteName = navigatorMode === 'MyAccount' && isTutorial && !auth
    ? 'IntroductoryTutorial'
    : navigatorMode;

  return (
    <Stack.Navigator key={navigatorMode} initialRouteName={initialRouteName}>
      {isProfileCompletionRequired ? (
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfile}
          options={{ headerShown: false }}
        />
      ) : isUserVerifyRequired && !isGuest ? (
        <Stack.Screen
          name="UserVerification"
          component={UserVerification}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MyAccount"
            component={HomeNavigator}
            options={{ headerShown: false }}
            initialParams={{
              productLogin,
              orderIdParam,
              cartUuidParam,
              storeParam,
              productParam,
              notification_state: oneSignalState
            }}
          />
          {!auth && isTutorial && (
            <Stack.Screen
              name="IntroductoryTutorial"
              component={IntroductoryTutorial}
              options={{ headerShown: false }}
              initialParams={{ setTutorial }}
            />
          )}
          {connectionState?.connection_status && (
            <>
              {initialScreens.map(screen => (
                <Stack.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  options={{ headerShown: false }}
                />
              ))}
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
                listeners={{
                  state: (e: any) => {
                    const store_slug = e.data?.state?.routes.find(
                      (object: any) => object?.params?.store_slug,
                    )?.params?.store_slug
                    const params = store_slug ? { store_slug } : {}
                    setProductLogin({
                      ...e.data.state.routes.find(
                        (object: any) => object?.params?.product,
                      )?.params?.product,
                      ...params
                    });
                  },
                }}
                initialParams={{ notification_state: oneSignalState, projectChanged: generalProjectState.changed }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
                initialParams={{ notification_state: oneSignalState, projectChanged: generalProjectState.changed }}
              />
              <Stack.Screen
                name="Forgot"
                component={Forgot}
                options={{ headerShown: false }}
              />
            </>
          )}
          {connectionState?.connection_status === false && (
            <Stack.Screen
              name='NetworkError'
              component={NetworkError}
              options={{ headerShown: false }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};
export default RootNavigator;
