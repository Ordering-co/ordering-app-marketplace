import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ChSection } from './styles';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Cart, useLanguage, useOrder, useUtils } from '@components';
import { OText } from '@ui';
import { MawejaArticles } from './layouts/Maweja';

const SummaryUI = (props: any) => {
  const { showComponent, businessId, HeaderTitle, loading, navigation } = props;

  const theme = useTheme();
  const [{ carts }] = useOrder();
  const [, t] = useLanguage();
  const [{ parsePrice, optimizeImage }] = useUtils();

  const cart = carts?.[`businessId:${businessId}`] ?? {};
  const cartProducts = cart?.products;
  // The API rejects any change to a cart with a payment in progress
  const isCartPending = cart?.status === 2;

  if (!showComponent) return null;

  if (props.layout === 'maweja' && !loading) {
    return (
      <MawejaArticles
        products={cartProducts}
        businessName={cart?.business?.name}
        parsePrice={parsePrice}
        optimizeImage={optimizeImage}
        title={`${t('ARTICLES', 'Articles')} (${cartProducts?.length || 0})`}
        addLabel={t('ADD_MORE_PRODUCTS', 'Add more products')}
        onAddProducts={!isCartPending && cart?.business?.slug && navigation
          ? () => navigation.navigate('Business', { store: cart.business.slug })
          : undefined}
        onEditCart={!isCartPending && navigation
          ? () => navigation.push('Cart', {
            businessSlug: cart?.business?.slug || cart?.business_id,
            fromCheckout: true,
            cartUuid: cart?.uuid
          })
          : undefined}
      />
    )
  }

  const toppingsRemoved: any = (product: any) => cart?.toppings_removed?.[product?.code];

  const productInfo: any = (product: any) => {
    let options = JSON.parse(JSON.stringify(Object.values(product.options ?? {})));
    const extraGroups = options.reduce((acc: any, option: any) => {
      const extraRank = option?.extra?.rank;
      acc[extraRank] = acc[extraRank] || [];
      acc[extraRank].push(option);
      return acc;
    }, {});

    const sortedExtraGroups = Object.entries(extraGroups).sort(([rankA]: any, [rankB]: any) => rankA - rankB);

    sortedExtraGroups.forEach(([_, group]: any) => {
      group.sort((a: any, b: any) => a.rank - b.rank);
    });

    options = sortedExtraGroups.flatMap(([, group]) => group);

    const ingredients = JSON.parse(JSON.stringify(Object.values(product.ingredients ?? {})));
    options = options.map((option: any) => {
      option.suboptions = Object.values(option.suboptions ?? {});
      return option;
    });
    return {
      ...productInfo,
      ingredients,
      options
    };
  };

  return (
    <ChSection style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      {loading ? (
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={{ flexDirection: 'column', marginBottom: 10 }}>
                <PlaceholderLine height={20} width={80} style={{ marginBottom: 5 }} />
                <PlaceholderLine height={20} width={60} />
              </View>
            ))}
          </View>
        </Placeholder>
      ) : (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {HeaderTitle}
            {navigation && !isCartPending && (
              <TouchableOpacity
                testID='checkout-edit-cart'
                onPress={() => navigation.navigate('UpsellingPage', { businessId: cart?.business_id })}
              >
                <MaterialCommunityIcon
                  name='pencil-outline'
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            {cartProducts?.map((product: any, index: number) => (
              <View key={product?.id + index} style={{ flexDirection: 'column', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <OText size={14} weight={'700'} style={{ width: 25 }}>
                    {product?.quantity || 0}
                  </OText>
                  <OText size={14} weight={'600'} style={{ flex: 1 }}>
                    {product?.name}
                  </OText>
                  <OText size={14} weight={'600'}>
                    {parsePrice(product?.total || product?.price)}
                  </OText>
                </View>
                {(
                  toppingsRemoved(product)?.removed?.length > 0 ||
                  productInfo(product)?.ingredients?.some((ingredient: any) => !ingredient.selected) ||
                  productInfo(product)?.options?.some((option: any) => option.suboptions.length > 0)
                ) && (
                    <OText size={12} weight={'400'}>
                      {[
                        ...(toppingsRemoved(product)?.removed ?? [])?.map((topping: any) => `${t('NO', 'No')} ${topping?.name}`),
                        ...(productInfo(product)?.ingredients ?? [])?.filter((ingredient: any) => !ingredient.selected).map((ingredient: any) => ingredient.name),
                        ...(productInfo(product)?.options ?? [])?.sort((a: any, b: any) => a.rank - b.rank).map((option: any) => option.suboptions.map((suboption: any) => `${option.name}: ${suboption.name}`)).flat()
                      ].join(', ')}
                    </OText>
                  )}
              </View>
            ))}
          </View>
        </>
      )}
    </ChSection>
  );
};

export const Summary = (props: any) => {
  const summaryProps = {
    ...props,
    UIComponent: SummaryUI
  };

  return (
    <Cart {...summaryProps} />
  );
}
