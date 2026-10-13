import * as React from 'react';
import { SafeAreaViewWrapper, UpsellingProducts as Upselling } from '@ui';

interface Props {
  navigation: any;
  route: any;
}

const UpsellingPage = (props: Props) => {

  const upsellingProps = {
    ...props,
    ...props.route.params,
    isPage: true,
    onGoBack: props?.navigation?.canGoBack()
      ? () => props?.navigation?.goBack()
      : () => props?.navigation?.navigate('BottomTab'),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
  };

  return (
    <SafeAreaViewWrapper pt disableScrollView>
      <Upselling {...upsellingProps} />
    </SafeAreaViewWrapper>
  );
};

export default UpsellingPage;
