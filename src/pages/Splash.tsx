import React from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OIcon, PoweredBy } from '@ui';

const Splash = () => {
  const theme = useTheme();
  const isIos = Platform.OS === 'ios'
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const getIsPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };
  let image
  if (isIos) {
    if (windowWidth === windowHeight) {
      image = theme?.ios?.components?.any?.image
    }
    if(getIsPortrait()){
      image = windowWidth <= 640
      ? theme?.ios?.components?.portrait?.dimensions?.iphone?.image
      : windowWidth <= 1242
        ? theme?.ios?.components?.portrait?.dimensions?.iphone_plus?.image
        : theme?.ios?.components?.portrait?.dimensions?.ipad?.image
    } else {
      image = windowWidth <= 2048
      ? theme?.ios?.components?.landscape?.dimensions?.ipad?.image
      : theme?.ios?.components?.landscape?.dimensions?.iphone?.image
    }
  } else {
    if (getIsPortrait()) {
      image = windowWidth <= 200
        ? theme?.android?.components?.portrait?.dimensions?.idpi?.image
        : windowWidth <= 720
          ? theme?.android?.components?.portrait?.dimensions?.xhdpi?.image
          : windowWidth <= 960
            ? theme?.android?.components?.portrait?.dimensions?.xxhdpi?.image
            : theme?.android?.components?.portrait?.dimensions?.xxxhdpi?.image
    } else {
      image = windowWidth <= 320
        ? theme?.android?.components?.landscape?.dimensions?.idpi?.image
        : windowWidth <= 1280
          ? theme?.android?.components?.landscape?.dimensions?.xhdpi?.image
          : windowWidth <= 1600
            ? theme?.android?.components?.landscape?.dimensions?.xxhdpi?.image
            : theme?.android?.components?.landscape?.dimensions?.xxxhdpi?.image
    }
  }

  return (
    <View style={styles.wrapper}>
      <OIcon src={image || theme.images.logos.logotype} style={styles.logo} />
      <PoweredBy />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 250,
    alignSelf: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default Splash;
