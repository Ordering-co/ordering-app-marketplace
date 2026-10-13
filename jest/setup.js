/**
 * Jest setup file referenced by jest.config.js (`setupFiles`).
 * Registers native-module mocks the React Native preset needs.
 */
/* eslint-env jest */

// Gesture handler ships its own jest setup.
try {
  require('react-native-gesture-handler/jestSetup');
} catch (e) {}

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Foundation', () => 'Icon');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 })
  };
});

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn()
  }),
  useRoute: () => ({ params: {} }),
  useFocusEffect: jest.fn()
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getBundleId: jest.fn(() => 'com.test.app')
}));

jest.mock('@intercom/intercom-react-native', () => ({
  registerIdentifiedUser: jest.fn(),
  logout: jest.fn()
}));

jest.mock('react-native-restart', () => ({
  restart: jest.fn()
}));

jest.mock('react-native-swiper-flatlist', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');

  function SwiperFlatList(props) {
    const { data = [], renderItem } = props;
    return React.createElement(
      View,
      { testID: 'swiper-flatlist' },
      data.map((item, index) =>
        React.createElement(
          TouchableOpacity,
          {
            key: `swiper-${index}`,
            testID: `swiper-item-${index}`,
            onPress: () => renderItem?.({ item, index })
          },
          renderItem?.({ item, index })
        )
      )
    );
  }

  return {
    __esModule: true,
    default: SwiperFlatList,
    SwiperFlatList
  };
});
