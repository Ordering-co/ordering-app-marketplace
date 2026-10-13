import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { OrderTypeSelectParams } from '../../types';
import { ORDER_TYPES } from '../../config/constants';
import { ORDER_TYPE_ICONS, DEFAULT_ORDER_TYPE_ICON } from '../../utils';
import { GridContainer, TypeCard, TypeIconWrapper } from './styles';
import { OrderTypeControl, useLanguage, useOrder } from '@components';

import { OText, FloatingButton } from '@ui';

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    handleChangeType,
    typeSelected,
    configTypes,
    orderTypes,
    goToBack,
    setOrderTypeValue
  } = props;

  const theme = useTheme();
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [currentOrderType, setCurrentOrderType] = useState<number>(typeSelected);

  const items = orderTypes
    .filter((type: any) => configTypes?.includes(type.value))
    .map((type: any) => {
      const typeConfig = theme?.order_types_config?.[`type${type.value}`] || {};
      const iconKey = type.value === 9 ? 'type3' : `type${type.value}`;
      return {
        value: type.value,
        label: typeConfig.name || t(type.content, type.content),
        iconName: ORDER_TYPE_ICONS[type.value] || DEFAULT_ORDER_TYPE_ICON,
      };
    });

  const screenWidth = Dimensions.get('window').width;
  const itemsPerRow = items.length >= 5 && screenWidth > 380 ? 3 : 2;
  const gap = theme.utils.margins.horizontal;
  const gridHorizontalPadding = theme.utils.margins.horizontal;

  const totalContentWidth = screenWidth - (2 * gridHorizontalPadding);
  const cardWidth = (totalContentWidth - ((itemsPerRow - 1) * gap)) / itemsPerRow;
  const marginBottomValue = gap;

  const handleChangeOrderTypeCallback = (orderType: number) => {
    if (!orderState.loading) {
      setCurrentOrderType(orderType)
    }
  }

  const handleContinue = () => {
    if (!orderState.loading) {
      handleChangeOrderType(currentOrderType)
      setOrderTypeValue && setOrderTypeValue(currentOrderType)
      goToBack()
    }
  }


  useEffect(() => {
    handleChangeType && handleChangeType(typeSelected)
  }, [typeSelected])

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.length > 0 ? (
          <GridContainer>
            {items.map((item: any, index: number) => {
              const marginRightValue = (index + 1) % itemsPerRow === 0 ? 0 : gap;
              return (
                <TypeCard
                  itemsPerRow={itemsPerRow}
                  activeOpacity={0.8}
                  key={item.value}
                  disabled={orderState.loading}
                  isSelected={item.value === currentOrderType}
                  cardWidth={cardWidth}
                  marginBottomValue={marginBottomValue}
                  marginRightValue={marginRightValue}
                  onPress={() => handleChangeOrderTypeCallback(item.value)}
                >
                  <TypeIconWrapper>
                    <Icon
                      name={item.iconName}
                      size={34}
                      color={item.value === currentOrderType ? theme.colors.active : theme.colors.black}
                    />
                  </TypeIconWrapper>
                  <OText weight={'600'}>{item.label}</OText>
                </TypeCard>
              )
            })}
          </GridContainer>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <OText>{t('NO_ORDER_TYPES_AVAILABLE', 'No order types available.')}</OText>
          </View>
        )}
        <View style={{ flex: 1 }} />
      </ScrollView>
      <FloatingButton
        text={t('CONTINUE', 'Continue')}
        handleClick={handleContinue}
        loading={typeSelected === undefined || typeSelected === null || orderState.loading}
      />
    </>
  );
};

export const OrderTypeSelector = (props: any) => {
  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorUI,
    orderTypes: props.orderTypes || ORDER_TYPES,
  };
  return <OrderTypeControl {...orderTypeProps} />;
};

