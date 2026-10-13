import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import { convertHoursToMinutes } from '../../utils'

import { useLanguage, useOrder, useUtils } from '@components'
import { OButton, OText } from '@ui'

dayjs.extend(timezone)
dayjs.extend(isBetween)

const CardContainer = styled(TouchableOpacity)`
  border-radius: 15px;
  padding: 15px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  elevation: 3;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const InfoText = styled.Text`
  font-size: ${(props: any) => props.theme.utils.tsize.m}px;
  color: ${(props: any) => props.theme.colors.textSecondary};
  margin-left: 4px;
  margin-right: 8px;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BusinessListItem = ({ item, onPress, onToggleFavorite, businessFavorite, handleBusinessClick }: any) => {
  const theme = useTheme();
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{ parseNumber, parsePrice, parseDistance, parseTime }] = useUtils();

  const deliveryTypes = [1, 7]

  const checkTime = (val: any) => val < 10 ? `0${val}` : val

  const findTodayLapse = () => {
    if (item?.today?.enabled) {
      const currentDate = dayjs().tz(item?.timezone)
      const lapse = item?.today?.lapses?.find((lapse: any) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
      return lapse || item?.today?.lapses?.[0]
    }
  }

  const getCategory = (item: any) => {
    const categories = {
      alcohol: item.alcohol ? t('ALCOHOL', 'Alcohol') : null,
      food: item.food ? t('FOOD', 'Food') : null,
      groceries: item.groceries ? t('GROCERIES', 'Groceries') : null,
      laundry: item.laundry ? t('LAUNDRY', 'Laundry') : null,
    }

    return Object.values(categories).find((category: any) => category !== null);
  }

  return (
    <CardContainer activeOpacity={0.7} onPress={() => onPress(item.id)}>
      <TopRow>
        <OText size={theme.utils.tsize.l} numberOfLines={2} weight="bold">{item.name}</OText>
        <TouchableOpacity activeOpacity={0.7} onPress={() => onToggleFavorite()}>
          <Icon
            name={businessFavorite ? "heart" : "heart-outline"}
            size={20}
            color={businessFavorite ? theme.colors.danger : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </TopRow>

      <InfoRow>
        {item?.reviews?.total > 0 && (
          <RatingContainer>
            <Icon name="star" size={16} color={theme.colors.active} />
            <OText size={theme.utils.tsize.m} mRight={4} weight="bold">
              {parseNumber(item?.reviews?.total, { separator: '.' })}
            </OText>
          </RatingContainer>
        )}
        {!!getCategory(item) && <InfoText>• {getCategory(item)}</InfoText>}
      </InfoRow>

      <InfoRow>
        {!!item?.delivery_time && (
          <>
            <Icon name="time-outline" size={16} color={theme.colors.textSecondary} />
            <InfoText>
              {`${convertHoursToMinutes(
                deliveryTypes.includes(orderState?.options?.type)
                  ? item?.delivery_time
                  : item?.pickup_time
              )}`}
            </InfoText>
          </>
        )}
        {deliveryTypes.includes(orderState?.options?.type) && !!item.delivery_price && (
          <>
            <MaterialCommunityIcons name="truck-delivery-outline" size={18} color={theme.colors.textSecondary} />
            <InfoText>{parsePrice(item?.delivery_price)}</InfoText>
          </>
        )}
        {!!item.distance && <InfoText>{parseDistance(item.distance)}</InfoText>}
      </InfoRow>

      <BottomRow>
        <OText size={theme.utils.tsize.s}>
          {item?.open && item?.today?.enabled ?
            `${t('OPEN_AT', 'OPEN AT')} ${parseTime(moment(`${checkTime(findTodayLapse()?.open?.hour)}:${checkTime(findTodayLapse()?.open?.minute)}`, 'HH:mm'))}`
            : t('STORE_CLOSED', 'Store closed')}
        </OText>
        <OButton
          text={item?.open && item?.today?.enabled ? t('ORDER_NOW', 'Order Now') : t('PRE_ORDER', 'Preorder')}
          onClick={() => handleBusinessClick(item)}
          class="alert"
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            height: 'auto',
            paddingVertical: 5,
          }}
        />
      </BottomRow>
    </CardContainer>
  );
};

export const BusinessFavoriteCard = (props: any) => {
  const {
    business,
    businessFavorite,
    handleChangeFavorite,
    handlePressBusiness,
    handleBusinessClick
  } = props

  return (
    <BusinessListItem
      item={business}
      businessFavorite={businessFavorite}
      onPress={handlePressBusiness}
      onToggleFavorite={handleChangeFavorite}
      handleBusinessClick={handleBusinessClick}
    />
  );
};
