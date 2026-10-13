import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ContainerButtons, SocialButton } from './styles'

export const UIButton = (props: any) => {
  const {
    onPress,
    iconName,
    iconSize,
    iconColor,
    buttonText,
    iconComponent: IconComponent
  } = props;

  return (
    <ContainerButtons>
      <SocialButton onPress={onPress}>
        {IconComponent ? (
          <View style={styles.btn}>
            {IconComponent}
          </View>
        ) : (
          <Icon
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={styles.btn}
          />
        )}
        <Text style={styles.text}>
          {buttonText}
        </Text>
      </SocialButton>
    </ContainerButtons>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginRight: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000000'
  }
});
