import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NetInfo from '@react-native-community/netinfo'

import BottomNavigator from '../navigators/BottomNavigator';
import AddressList from '../pages/AddressList';
import SavedCards from '../pages/SavedCards';
import MyStudents from '../pages/MyStudents';
import AddressForm from '../pages/AddressForm';
import OrderDetails from '../pages/OrderDetails';
import MessageView from '../pages/MessageView';
import BusinessProductsList from '../pages/BusinessProductsList';
import ProductDetails from '../pages/ProductDetails';
import UpsellingPage from '../pages/UpsellingPage';
import ReviewOrder from '../pages/ReviewOrder';
import ReviewProducts from '../pages/ReviewProducts';
import ReviewDriver from '../pages/ReviewDriver';
import MomentOption from '../pages/MomentOption';
import OrderTypes from '../pages/OrderTypes';
import Help from '../pages/Help';
import HelpOptions from '../pages/HelpOptions';
import BusinessPreorder from '../pages/BusinessPreorder';
import Messages from '../pages/Messages'
import Favorite from '../pages/Favorite';
import BusinessListingSearch from '../pages/BusinessListingSearch'
import BusinessSearchMap from '../pages/BusinessSearchMap'
import Promotions from '../pages/Promotions'
import Sessions from '../pages/Sessions';
import MultiOrdersDetails from '../pages/MultiOrdersDetails';
import Notifications from '../pages/Notifications'
import CheckoutPage from '../pages/Checkout';
import CouponOffers from '../pages/CouponOffers';
import Home from '../pages/Home';
import CartList from '../pages/CartList';
import MultiCheckout from '../pages/MultiCheckout';
import MultiCart from '../pages/MultiCart'
import UserVerification from '../pages/UserVerification';
import NetworkError from '../pages/NetworkError';
import Languages from '../pages/Languages';
import UserProfileForm from '../pages/UserProfileForm';
import CashWallet from '../pages/CashWallet';
import LoyaltyPoints from '../pages/LoyaltyPoints';
import GiftCards from '../pages/GiftCards';

import { useSession, useOrder, useConfig } from '@components';
import { orderTypeList } from '@ui';
import { getHomeDeepLinkPlan } from './getHomeDeepLinkPlan';

const Stack = createStackNavigator();

const HomeNavigator = (e: any) => {
  const { navigation, route } = e;

  const [orderState] = useOrder();
  const [{ auth, user }] = useSession();
  const [{ configs }] = useConfig()

  const [connectionState, setConnectionState] = React.useState<{
    connection_status: boolean;
  } | null>(null);

  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified
  const isUserVerifyRequired = isEmailVerifyRequired || isPhoneVerifyRequired

  const cartUuid = route?.params?.cartUuid;

  const guestCheckoutEnabled =
    configs?.guest_checkout_enabled?.value === '1' &&
    (!orderTypeList[orderState?.options?.type - 1] || configs?.allowed_order_types_guest_checkout?.value?.includes(orderTypeList[orderState?.options?.type - 1])) &&
    user?.guest_id

  const handleConnectivityChange = (state: any) => {
    setConnectionState({ connection_status: state.isConnected });
  };

  let netInfoSuscription: any = null
  React.useEffect(() => {
    netInfoSuscription = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      netInfoSuscription && netInfoSuscription()
    }
  }, []);

  const orderIdParam = route?.params?.orderIdParam
  const cartUuidParam = route?.params?.cartUuidParam
  const storeParam = route?.params?.storeParam
  const productParam = route?.params?.productParam
  const productId = productParam?.productId
  const categoryId = productParam?.categoryId
  const businessId = productParam?.businessId

  React.useEffect(() => {
    const plan = getHomeDeepLinkPlan({
      orderIdParam,
      cartUuidParam,
      storeParam,
      productParam
    })
    if (!plan.screen) return
    navigation.navigate(plan.screen, plan.routeParams)
  }, [orderIdParam, cartUuidParam, storeParam, productId, categoryId, businessId, navigation])

  return (
    <Stack.Navigator>
      {connectionState?.connection_status === false && (
        <Stack.Screen
          name='NetworkError'
          component={NetworkError}
          options={{ headerShown: false }}
        />
      )}
      {isUserVerifyRequired && !guestCheckoutEnabled && (
        <Stack.Screen
          name="UserVerification"
          component={UserVerification}
          options={{ headerShown: false }}
        />
      )}
      {!auth && (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="BottomTab"
        component={BottomNavigator}
        options={{ headerShown: false }}
        initialParams={{ notification_state: e?.route?.params?.notification_state }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SavedCards"
        component={SavedCards}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyStudents"
        component={MyStudents}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiCart"
        component={MultiCart}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiCheckout"
        children={({ navigation: multiCheckoutNavigation, route: multiCheckoutRoute }) => (
          <MultiCheckout navigation={multiCheckoutNavigation} route={multiCheckoutRoute} />
        )}
        options={{ headerShown: false, animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen
        name="MultiOrdersDetails"
        component={MultiOrdersDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BusinessPreorder"
        component={BusinessPreorder}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MomentOption"
        component={MomentOption}
        options={{ headerShown: false }}
      />
      {!cartUuid && (
        <Stack.Screen
          name="Cart"
          component={CartList}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 250 } },
            close: { animation: 'timing', config: { duration: 200 } }
          }
        }}
      />
      <Stack.Screen
        name="CheckoutPage"
        component={CheckoutPage}
        options={{ headerShown: false, animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen
        name="CouponOffers"
        component={CouponOffers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpsellingPage"
        component={UpsellingPage}
        options={{ headerShown: false, animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen
        name="ReviewOrder"
        component={ReviewOrder}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewProducts"
        component={ReviewProducts}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewDriver"
        component={ReviewDriver}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Business"
        component={BusinessProductsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderTypes"
        component={OrderTypes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileForm"
        component={UserProfileForm}
        options={{ headerShown: false }}
        initialParams={{ afterSignup: false }}
      />
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessageView"
        component={MessageView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Languages"
        component={Languages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Help"
        children={(props: any) => <Help {...props} />}
        options={{ headerShown: false }}
        initialParams={{ afterSignup: false }}
      />
      <Stack.Screen
        name="HelpOptions"
        component={HelpOptions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sessions"
        component={Sessions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CashWallet"
        component={CashWallet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoyaltyPoints"
        component={LoyaltyPoints}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GiftCards"
        component={GiftCards}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessSearchMap"
        component={BusinessSearchMap}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
