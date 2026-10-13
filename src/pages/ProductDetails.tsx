import * as React from 'react';
import { ProductForm as ProductFormController, SafeAreaViewWrapper } from '@ui';
import { leaveToCheckoutOrBack } from '@/utils/checkoutReturn';

interface Props {
  navigation: any;
  route: any;
}
const ProductDetails = (props: Props) => {
  const productProps = {
    ...props,
    isCartProduct: props.route.params?.isCartProduct,
    isFromCheckout: props.route.params?.isFromCheckout,
    productCart: props.route.params?.productCart,
    setProductLogin: props.route.params?.setProductLogin,
    product: props.route.params?.product,
    business: props.route.params?.business,
    businessSlug: props.route.params?.businessSlug,
    businessId: props.route.params?.businessId,
    categoryId: props.route.params?.categoryId,
    productId: props.route.params?.productId,
    callbackAfterUpdateCart: props.route.params?.callbackAfterUpdateCart,
    productAddedToCartLength: props.route.params?.productAddedToCartLength || 0,
    onSave: props.route?.params?.fromCheckout
      ? () => leaveToCheckoutOrBack(props.navigation, props.route)
      : props?.navigation?.canGoBack()
        ? (props?.route?.params?.isRedirect === 'business' && !props?.route?.params?.alreadyInBusinessListing ? () => props?.navigation?.replace('Business', {
          store: props?.route?.params?.business?.store,
          header: props?.route?.params?.business?.header,
          logo: props?.route?.params?.business?.logo,
        }) : () => props?.navigation?.goBack())
        : () => props?.navigation?.navigate('BottomTab'),
    onGoBack: props.route?.params?.fromCheckout
      ? () => leaveToCheckoutOrBack(props.navigation, props.route)
      : props?.navigation?.canGoBack()
        ? () => props?.navigation?.goBack()
        : () => props?.navigation?.navigate('BottomTab'),
  };

  return (
    <SafeAreaViewWrapper pt disableScrollView>
      <ProductFormController {...productProps} />
    </SafeAreaViewWrapper>
  );
};

export default ProductDetails;
