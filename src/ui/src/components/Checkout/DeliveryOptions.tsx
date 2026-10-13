import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, I18nManager, StyleSheet, FlatList } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { ChSection, DeliveryOptionItem, DeliveryOptionsContainer } from './styles';
import { useLanguage } from '@components';
import { OBottomPopup, OText } from '@ui';

export const DeliveryOptionsComponent = (props: any) => {
  const {
    HeaderTitle,
    loading,
    cartUuid,
    deliveryOptions,
    showComponent,
    deliveryOptionSelected,
    handleChangeDeliveryOption
  } = props

  if (!showComponent) return null;

  const theme = useTheme();
  const [, t] = useLanguage();

  const [isDeliveryOptionModalVisible, setIsDeliveryOptionModalVisible] = useState(false)

  const changeDeliveryOption = (option: any) => {
    handleChangeDeliveryOption(option)
    setIsDeliveryOptionModalVisible(false)
  }

  const styles = StyleSheet.create({
    icon: {
      top: 15,
      right: Platform.OS === 'ios' ? 5 : (I18nManager.isRTL ? 30 : 0),
      position: 'absolute',
      fontSize: 20
    },
  })

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => !!cartUuid && changeDeliveryOption(item.value)}
      disabled={
        deliveryOptionSelected === item.value
      }
    >
      <DeliveryOptionItem
        active={deliveryOptionSelected === item.value}
      >
        <OText color={deliveryOptionSelected === item.value ? theme.colors.active : theme.colors.black}>{item.label}</OText>
      </DeliveryOptionItem>
    </TouchableOpacity>
  )

  return (
    <DeliveryOptionsContainer>
      {(loading || deliveryOptionSelected === undefined) ? (
        <View style={{ marginTop: 20 }}>
          <Placeholder Animation={Fade}>
            <PlaceholderLine height={40} style={{ marginBottom: 0 }} />
          </Placeholder>
        </View>
      ) : (
        <ChSection>
          {HeaderTitle}
          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setIsDeliveryOptionModalVisible(true)}>
            <DeliveryOptionItem active>
              <OText color={theme.colors.active}>
                {deliveryOptions.find((option: any) => option.value === deliveryOptionSelected)?.label}
              </OText>
              <MaterialIcons name='keyboard-arrow-down' style={styles.icon} color={theme.colors.textNormal} />
            </DeliveryOptionItem>
          </TouchableOpacity>
          <OBottomPopup
            open={isDeliveryOptionModalVisible}
            onClose={() => setIsDeliveryOptionModalVisible(false)}
            title={t('SPECIAL_INSTRUCTIONS', 'Special instructions')}
            presentationStyle="overFullScreen"
            bottomContainerStyle={{ height: '50%' }}
            transparent
            closeIcon
          >
            <View style={{ paddingHorizontal: 20 }}>
              <FlatList
                data={deliveryOptions}
                renderItem={renderItem}
              />
            </View>
          </OBottomPopup>
        </ChSection>
      )}
    </DeliveryOptionsContainer>
  );
};
