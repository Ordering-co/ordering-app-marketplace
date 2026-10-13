import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import BusinessList from '../pages/BusinessesListing';
import AddressList from '../pages/AddressList';
import BusinessListingSearch from '../pages/BusinessListingSearch';
import MyOrders from '../pages/MyOrders';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Promotions from '../pages/Promotions';

import { useLanguage, useSession, useEvent, useOrder } from '@components';
import { ACCOUNT_VALUES } from '@ui';

const Tab = createBottomTabNavigator();

const BottomNavigator = (props: any) => {
  const theme = useTheme();
  const [, t] = useLanguage();
  const [events] = useEvent()
  const [{ options }] = useOrder()
  const [{ auth, user }] = useSession()

  const insets = useSafeAreaInsets()
  const [accountState, setAccountState] = useState('')
  const [shouldClearSearchTerm, setShouldClearSearchTerm] = useState(false)

  const styles = StyleSheet.create({
    iconStyle: {
      width: 19,
      height: 19,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    barStyle: {
      backgroundColor: theme.colors.backgroundPage,
      height: 60 + insets.bottom,
      paddingTop: 10,
      display: auth ? 'flex' : 'none',
      ...Platform.OS === 'android' && { paddingBottom: insets.bottom + 10 },
    }
  })

  useEffect(() => {
    const handleLogout = () => {
      setAccountState('')
      props.navigation?.getParent()?.navigate('Home')
    }
    events.on('logout', handleLogout)
    return () => {
      events.off('logout', handleLogout)
    }
  }, [])

  const propsToPass = {
    ...props,
    setAccountState,
    isLogin: props?.route?.params?.isLogin,
    notification_state: props?.route?.params?.notification_state
  }

  const TabBarIcon = ({ name, focused, rotate = 0 }: any) => (
    <View style={styles.iconStyle}>
      <Icon
        name={name}
        size={19}
        color={focused ? theme.colors.active : theme.colors.black}
        style={{ opacity: focused ? 1 : 0.6, transform: [{ rotate: `${rotate}deg` }] }}
      />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }}>
      <Tab.Navigator
        initialRouteName={"Home"}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme.colors.active,
          tabBarInactiveTintColor: theme.colors.black,
          tabBarLabelStyle: { fontSize: theme.utils.tsize.s },
          tabBarStyle: styles.barStyle
        }}
      >
        <Tab.Screen
          name="Home"
          children={(screenProps: any) => {
            const currentRouteTarget = screenProps.route.params?.target;

            React.useEffect(() => {
              if (currentRouteTarget) {
                let newAccountStateValue = null;
                if (currentRouteTarget === 'LOGIN') {
                  newAccountStateValue = ACCOUNT_VALUES.LOGIN;
                } else if (currentRouteTarget === 'SIGNUP') {
                  newAccountStateValue = ACCOUNT_VALUES.SIGNUP;
                }

                if (newAccountStateValue && newAccountStateValue !== accountState) {
                  setAccountState(newAccountStateValue);
                }
              }
            }, [currentRouteTarget, accountState]);

            React.useEffect(() => {
              if (currentRouteTarget) {
                const targetMatchesAccountState =
                  (currentRouteTarget === 'LOGIN' && accountState === ACCOUNT_VALUES.LOGIN) ||
                  (currentRouteTarget === 'SIGNUP' && accountState === ACCOUNT_VALUES.SIGNUP);

                if (targetMatchesAccountState) {
                  screenProps.navigation.setParams({ target: undefined });
                }
              }
            }, [currentRouteTarget, accountState, screenProps.navigation]);

            let componentToRender;

            if (((accountState === ACCOUNT_VALUES.ACCOUNT) || auth)) {
              componentToRender = !options?.address_id
                ? <AddressList {...propsToPass} />
                : <BusinessList {...propsToPass} />;
            } else {
              if (currentRouteTarget === 'LOGIN') {
                componentToRender = <Login {...propsToPass} onNavigateToSignup={() => setAccountState(ACCOUNT_VALUES.SIGNUP)} />;
              } else if (currentRouteTarget === 'SIGNUP') {
                componentToRender = <Signup {...propsToPass} onNavigateToLogin={() => setAccountState(ACCOUNT_VALUES.LOGIN)} />;
              } else {
                if ((accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)) {
                  componentToRender = <Login {...propsToPass} onNavigateToSignup={() => setAccountState(ACCOUNT_VALUES.SIGNUP)} />;
                } else if (accountState === ACCOUNT_VALUES.SIGNUP) {
                  componentToRender = <Signup {...propsToPass} onNavigateToLogin={() => setAccountState(ACCOUNT_VALUES.LOGIN)} />;
                } else {
                  componentToRender = <Forgot {...propsToPass} />;
                }
              }
            }
            return componentToRender;
          }}
          options={{
            tabBarLabel: t('HOME', 'Home'),
            tabBarIcon: ({ focused }: any) => <TabBarIcon name="home-outline" focused={focused} />
          }}
        />
        <Tab.Screen
          name="Offers"
          children={() => (
            (accountState === ACCOUNT_VALUES.ACCOUNT || auth)
              ? <Promotions {...propsToPass} />
              : (accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)
                ? <Login {...propsToPass} />
                : accountState === ACCOUNT_VALUES.SIGNUP
                  ? <Signup {...propsToPass} />
                  : <Forgot {...propsToPass} />
          )}
          options={{
            tabBarLabel: t('OFFERS', 'Offers'),
            tabBarIcon: ({ focused }: any) => <TabBarIcon name="pricetags-outline" focused={focused} rotate={270} />
          }}
        />
        <Tab.Screen
          name="BusinessSearch"
          children={() => (
            (accountState === ACCOUNT_VALUES.ACCOUNT || auth)
              ? <BusinessListingSearch {...propsToPass} shouldClearSearchTerm={shouldClearSearchTerm} setShouldClearSearchTerm={setShouldClearSearchTerm} />
              : (accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)
                ? <Login {...propsToPass} />
                : accountState === ACCOUNT_VALUES.SIGNUP
                  ? <Signup {...propsToPass} />
                  : <Forgot {...propsToPass} />
          )}
          listeners={{
            blur: () => {
              setShouldClearSearchTerm(true);
            }
          }}
          options={{
            tabBarLabel: t('BROWSE', 'Browse'),
            tabBarIcon: ({ focused }: any) => <TabBarIcon name="search-outline" focused={focused} />
          }}
        />
        <Tab.Screen
          name="MyOrders"
          children={() => (
            (accountState === ACCOUNT_VALUES.ACCOUNT || auth)
              ? <MyOrders {...propsToPass} />
              : (accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)
                ? <Login {...propsToPass} />
                : accountState === ACCOUNT_VALUES.SIGNUP
                  ? <Signup {...propsToPass} />
                  : <Forgot {...propsToPass} />
          )}
          options={{
            tabBarLabel: t('ORDERS', 'Orders'),
            tabBarIcon: ({ focused }: any) => <TabBarIcon name="bag-outline" focused={focused} />
          }}
        />
        <Tab.Screen
          name="Profile"
          children={(screenProps: any) => {
            const currentRouteTarget = screenProps.route.params?.target;

            React.useEffect(() => {
              if (currentRouteTarget) {
                let newAccountStateValue = null;
                if (currentRouteTarget === 'LOGIN') {
                  newAccountStateValue = ACCOUNT_VALUES.LOGIN;
                } else if (currentRouteTarget === 'SIGNUP') {
                  newAccountStateValue = ACCOUNT_VALUES.SIGNUP;
                }

                if (newAccountStateValue && newAccountStateValue !== accountState) {
                  console.log('newAccountStateValue', accountState, newAccountStateValue);

                  setAccountState(newAccountStateValue);
                }
              }
            }, [currentRouteTarget, accountState]);

            React.useEffect(() => {
              if (currentRouteTarget) {
                const targetMatchesAccountState =
                  (currentRouteTarget === 'LOGIN' && accountState === ACCOUNT_VALUES.LOGIN) ||
                  (currentRouteTarget === 'SIGNUP' && accountState === ACCOUNT_VALUES.SIGNUP);

                if (targetMatchesAccountState) {
                  screenProps.navigation.setParams({ target: undefined });
                }
              }
            }, [currentRouteTarget, accountState, screenProps.navigation]);

            let componentToRender;

            if (((accountState === ACCOUNT_VALUES.ACCOUNT) || auth)) {
              componentToRender = <Profile {...propsToPass} />;
            } else {
              if (currentRouteTarget === 'LOGIN') {
                componentToRender = <Login {...propsToPass} onNavigateToSignup={() => setAccountState(ACCOUNT_VALUES.SIGNUP)} />;
              } else if (currentRouteTarget === 'SIGNUP') {
                componentToRender = <Signup {...propsToPass} onNavigateToLogin={() => setAccountState(ACCOUNT_VALUES.LOGIN)} />;
              } else {
                if ((accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)) {
                  componentToRender = <Login {...propsToPass} onNavigateToSignup={() => setAccountState(ACCOUNT_VALUES.SIGNUP)} />;
                } else if (accountState === ACCOUNT_VALUES.SIGNUP) {
                  componentToRender = <Signup {...propsToPass} onNavigateToLogin={() => setAccountState(ACCOUNT_VALUES.LOGIN)} />;
                } else {
                  componentToRender = <Forgot {...propsToPass} />;
                }
              }
            }
            return componentToRender;
          }}
          options={{
            tabBarLabel: t('PROFILE', 'Profile'),
            tabBarIcon: ({ focused }: any) => <TabBarIcon name="person-circle-outline" focused={focused} />
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigator;
