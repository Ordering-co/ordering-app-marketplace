import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image'

import { SingleProductCardParams } from '../../types';
import { lightenDarkenColor, shape } from '../../utils';
import { QuantityContainer, AdaptedCardContainer, ContentContainer, BottomRow, PriceFavoriteContainer, ProductImageContainer, ProductImageStyled, RibbonBox, TagsContainer } from './styles';
import { CustomItem } from './CustomItem';
import { areSingleProductCardPropsEqual } from './areSingleProductCardPropsEqual';

import {
  useLanguage,
  useConfig,
  useOrder,
  useUtils,
  useSession,
  ToastType,
  useToast,
  SingleProductCard as SingleProductCardController
} from '@components';

import {
  CardAnimation,
  OButton,
  OText,
  LottieAnimation,
  CategoryDescriptionMemoized
} from '@ui'

const descriptionLength = 50

const SingleProductCardUI = React.memo((props: SingleProductCardParams) => {
  const {
    product,
    isSoldOut,
    onProductClick,
    productAddedToCartLength,
    style,
    handleFavoriteProduct,
    navigation,
    isPreviously,
    isFeatured,
    useCustomFunctionality,
    onCustomClick,
    customText,
  } = props;

  const theme = useTheme();
  const hideProductDescription = theme?.business_view?.components?.products?.components?.product?.components?.description?.hidden;
  const hideProductLogo = props.viewString
    ? theme?.[props.viewString]?.components?.cart?.components?.products?.image?.hidden
    : theme?.business_view?.components?.products?.components?.product?.components?.image?.hidden;
  const hideFavoriteIcon = theme?.business_view?.components?.products?.components?.product?.components?.favorite?.hidden;

  const styles = StyleSheet.create({
    soldOutBackgroundStyle: {
      backgroundColor: theme.colors.disabled,
      opacity: 0.7,
    },
    productTagsStyle: {
      width: 30,
      height: 30,
      marginRight: 5,
    },
  });

  const [, t] = useLanguage();
  const [stateConfig] = useConfig();
  const [{ auth }] = useSession();
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils();
  const [orderState] = useOrder();
  const [, { showToast }] = useToast();
  const [openDescription, setOpenDescription] = useState<any>(null);

  const editMode = typeof product?.code !== 'undefined';
  const removeToBalance = editMode ? product?.quantity : 0;
  const cartProducts: any = Object.values(orderState?.carts || {})?.reduce?.((products: any, _cart: any) => [...products, ..._cart?.products], []);
  const productBalance = cartProducts?.reduce?.((sum: any, _product: any) => sum + (_product.id === product?.id ? _product.quantity : 0), 0);
  const totalBalance = (productBalance || 0) - removeToBalance;
  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance;
  let maxCartProductInventory = (product?.inventoried ? product?.quantity : undefined) - totalBalance;
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig;
  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory);
  const isActuallySoldOut = isSoldOut || maxProductQuantity <= 0;

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProduct && handleFavoriteProduct(!product?.favorite);
    } else {
      navigation && navigation.navigate('Login');
    }
  };

  const handleClickproduct = () => {
    if (productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order) {
      showToast(ToastType.Error, t('PRODUCT_ON_MAXIMUM_ORDER', 'The product is on maximum order'));
      return;
    }
    if (!useCustomFunctionality && onProductClick) {
      onProductClick(product);
    } else if (useCustomFunctionality && onCustomClick) {
      onCustomClick();
    }
  };

  const handleOrderButtonClick = () => {
    if (productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order) {
      showToast(ToastType.Error, t('PRODUCT_ON_MAXIMUM_ORDER', 'The product is on maximum order'));
      return;
    }
    if (!useCustomFunctionality && onProductClick) {
      onProductClick(product, true);
    } else if (useCustomFunctionality && onCustomClick) {
      onCustomClick();
    }
  }

  const isDescriptionLong = useMemo(() => product?.description?.length > descriptionLength, [product?.description]);
  const shortProductDescription = useMemo(() => isDescriptionLong ? `${product?.description?.substring(0, descriptionLength)}...` : product?.description, [product?.description, isDescriptionLong]);

  if (useCustomFunctionality && customText) {
    return (
      <CardAnimation onClick={onCustomClick} style={style}>
        <AdaptedCardContainer style={{ justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
          <OText preset="cardTitle">{customText}</OText>
        </AdaptedCardContainer>
      </CardAnimation>
    );
  }

  if (isPreviously) {
    return (
      <CustomItem
        isPreviously
        name={product?.name}
        image={product?.images ? {
          uri: optimizeImage(product?.images, 'w_160,h_160,c_limit'),
          priority: FastImage.priority.normal,
        } : undefined}
        price={parsePrice(product?.price)}
        lastOrderedDate={parseDate(product?.last_ordered_date, { outputFormat: 'MMM DD, YYYY' })}
        ribbon={product?.ribbon}
        onClick={handleClickproduct}
      />
    )
  }

  if (isFeatured) {
    return (
      <CustomItem
        isFeatured
        name={product?.name}
        image={product?.images ? {
          uri: optimizeImage(product?.images, 'w_160,h_160,c_limit'),
          priority: FastImage.priority.normal,
        } : undefined}
        price={parsePrice(product?.price)}
        ribbon={product?.ribbon}
        onClick={handleClickproduct}
      />
    )
  }

  return (
    <CardAnimation
      onClick={handleClickproduct}
      style={[style, isActuallySoldOut && styles.soldOutBackgroundStyle, { marginBottom: 20 }]}
    >
      <AdaptedCardContainer hideBorder={props.hideBorder}>
        {productAddedToCartLength > 0 && (
          <QuantityContainer>
            <OText size={12} color={theme.colors.white}>
              {productAddedToCartLength.toString()}
            </OText>
          </QuantityContainer>
        )}
        <ContentContainer>
          <OText preset="cardTitle" numberOfLines={2}>{product?.name}</OText>

          {!hideProductDescription && product?.description && (
            <View>
              <OText numberOfLines={3} ellipsizeMode="tail">
                {shortProductDescription}
              </OText>
              {isDescriptionLong && (
                <Pressable
                  style={{ height: 16, alignSelf: 'flex-start' }}
                  onPress={() => setOpenDescription({ name: product.name, description: product?.description, image: product.images })}
                >
                  <OText size={theme.utils.tsize.s || 12} color={theme.colors.active}>{t('VIEW_MORE', 'View more')}</OText>
                </Pressable>
              )}
            </View>
          )}

          <BottomRow>
            <PriceFavoriteContainer>
              {product?.price != null && (
                <OText weight="bold" size={theme.utils.tsize.m} mRight={20}>{parsePrice(product?.price)}</OText>
              )}
              {!hideFavoriteIcon && (
                <LottieAnimation
                  type='favorite'
                  onClick={handleChangeFavorite}
                  initialValue={product?.favorite ? 0.5 : 0}
                  toValue={product?.favorite ? 0 : 0.5}
                  disableAnimation={!auth}
                  iconProps={{ color: theme.colors.danger, size: 18 }}
                  isActive={product?.favorite}
                />
              )}
            </PriceFavoriteContainer>
            {product?.tags && product?.tags.length > 0 && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{ marginLeft: 10 }}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {product?.tags.map((tag: any, i: any) => (
                  tag?.image ? (
                    <TouchableWithoutFeedback key={i}>
                      <TagsContainer>
                        <FastImage
                          style={styles.productTagsStyle}
                          source={{
                            uri: optimizeImage(tag.image, 'h_250,c_limit'),
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </TagsContainer>
                    </TouchableWithoutFeedback>
                  ) : null
                ))}
              </ScrollView>
            )}
          </BottomRow>
        </ContentContainer>

        {!hideProductLogo && !!product?.images && (
          <View style={{ position: 'relative' }}>
            {!!product?.ribbon?.enabled && (
              <RibbonBox
                bgColor={product?.ribbon?.color}
                colorText={lightenDarkenColor(product?.ribbon?.color)}
                borderRibbon={lightenDarkenColor(product?.ribbon?.color)}
                isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
                isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
              >
                <OText
                  size={10}
                  weight={'400'}
                  color={lightenDarkenColor(product?.ribbon?.color) ? theme.colors.black : theme.colors.white}
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  lineHeight={13}
                >
                  {product?.ribbon?.text}
                </OText>
              </RibbonBox>
            )}
          <ProductImageContainer>
            <ProductImageStyled
              source={{
                uri: optimizeImage(product?.images, 'w_160,h_160,c_limit'),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </ProductImageContainer>
          </View>
        )}
      </AdaptedCardContainer>
      {!!openDescription && (
        <CategoryDescriptionMemoized
          openDescription={openDescription}
          setOpenDescription={setOpenDescription}
        />
      )}
    </CardAnimation>
  )
}, areSingleProductCardPropsEqual);

export const SingleProductCard = (props: SingleProductCardParams) => {
  const singleProductCardProps = {
    ...props,
    UIComponent: SingleProductCardUI
  }
  return <SingleProductCardController {...singleProductCardProps} />
}
