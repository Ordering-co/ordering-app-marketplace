import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

import { useLanguage } from '@components';
import { OIcon, OText } from '@ui';
import { lightenDarkenColor, shape } from '../../utils';
import { RibbonBox } from './styles';

export const CustomItem = (props: any) => {
  const {
    name,
    image,
    price,
    reviewsTotal,
    lastOrderedDate,
    isPreviously,
    isFeatured,
    isUpselling,
    ribbon,
    onClick
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();

  const CardContainer = styled(TouchableOpacity)`
    border-radius: ${(props: any) => props.theme.utils.radius.l}px;
    width: 100%;
  `;

  const ImageContainer = styled.View`
    width: 100%;
    aspect-ratio: ${isPreviously ? 1.7 : 1};
    background-color: ${(props: any) => props.theme.colors.border};
    border-radius: 20px;
    overflow: hidden;
  `;

  return (
    <CardContainer onPress={() => onClick && onClick()} activeOpacity={0.8}>
      <View style={{ position: 'relative' }}>
        {!!ribbon?.enabled && (
          <RibbonBox
            bgColor={ribbon?.color}
            colorText={lightenDarkenColor(ribbon?.color)}
            borderRibbon={lightenDarkenColor(ribbon?.color)}
            isRoundRect={ribbon?.shape === shape?.rectangleRound}
            isCapsule={ribbon?.shape === shape?.capsuleShape}
          >
            <OText
              size={10}
              weight={'400'}
              color={lightenDarkenColor(ribbon?.color) ? theme.colors.black : theme.colors.white}
              numberOfLines={2}
              ellipsizeMode='tail'
              lineHeight={13}
            >
              {ribbon?.text}
            </OText>
          </RibbonBox>
        )}
        {!!image && (
          <ImageContainer>
            <FastImage
              style={{ width: '100%', height: '100%' }}
              source={image}
              resizeMode={FastImage.resizeMode.cover}
            />
          </ImageContainer>
        )}
        {isFeatured && !!image && (
          <View style={{ position: 'absolute', bottom: -10, right: 0 }}>
            <OIcon src={theme.images.general.add} width={65} height={65} />
          </View>
        )}
      </View>
      <OText preset="cardTitle" numberOfLines={1}>{name}</OText>
      {isPreviously && (
        <OText>{t('LAST_ORDERED_ON', 'Last ordered on')} {lastOrderedDate}</OText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: isUpselling ? 'flex-end' : 'center',
          justifyContent: 'space-between'
        }}
      >
        <OText size={14} weight='600'>{price}</OText>
        {isFeatured && reviewsTotal && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
            <OIcon src={theme.images.general.star} width={14} color={theme.colors.star} />
            <OText mLeft={5} weight={600} color={theme.colors.star}>
              {reviewsTotal}
            </OText>
          </View>
        )}
        {isUpselling && (
          <TouchableOpacity onPress={() => onClick && onClick()} activeOpacity={0.8}>
            <OIcon
              src={theme.images.general.tag_plus}
              width={20}
              height={20}
              color={theme.colors.white}
              style={{ borderRadius: 8 }}
              wrapStyle={{ backgroundColor: theme.colors.black, padding: 5, marginTop: 5 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </CardContainer>
  );
};
