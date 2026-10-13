import React from 'react';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

import { ChSection, ChBusinessDetails, BusinessCopy, ProductImageIcon, Divider } from './styles';
import { Card, CardBody } from './layouts/Maweja/styles';
import { OText } from '@ui';
import { View } from 'react-native';

export const BusinessDetailsComponent = (props: any) => {
  const { business, loading, error, showComponent, layout } = props;
  const theme = useTheme();
  const isMaweja = layout === 'maweja'
  const businessPhone = business?.cellphone || business?.phone

  if (!showComponent) return null;

  const details = (
    <>
      {!isMaweja && <Divider />}
      {!loading && (
        <ChBusinessDetails style={isMaweja ? { borderBottomWidth: 0, paddingBottom: 0 } : undefined}>
          <ProductImageIcon
            source={business?.logo ? {
              uri: business?.logo,
              priority: FastImage.priority.normal,
            } : theme?.images?.dummies?.businessLogo}
            resizeMode={FastImage.resizeMode.cover}
          />
          <BusinessCopy style={isMaweja ? { minWidth: 0 } : undefined}>
            <OText weight={'bold'} numberOfLines={isMaweja ? 2 : undefined}>
              {business?.name}
            </OText>
            {!!businessPhone && (
              <OText size={12} color={theme.colors.textNormal}>
                {businessPhone}
              </OText>
            )}
          </BusinessCopy>
        </ChBusinessDetails>
      )}
      {loading && !error &&
        (
          <Placeholder Animation={Fade}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              paddingBottom: 20
            }}>
              <PlaceholderLine height={44} width={20} style={{ marginRight: 20, marginBottom: 0 }} />
              <PlaceholderLine height={35} width={65} style={{ marginBottom: 0 }} />
            </View>
          </Placeholder>
        )}
    </>
  )

  if (isMaweja) {
    return (
      <Card>
        <CardBody>{details}</CardBody>
      </Card>
    )
  }

  return <ChSection>{details}</ChSection>
};
