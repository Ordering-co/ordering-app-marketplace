import { View } from 'react-native';
import { useTheme } from 'styled-components/native';

import { OrderProgressWrapper } from './styles'
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

export const OrderStatusSkeleton = () => {
  const theme = useTheme();

  return (
    <OrderProgressWrapper>
      <View style={{ padding: 12, borderRadius: 15, borderWidth: 1, borderColor: theme.colors.border }}>
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
            <PlaceholderMedia size={60} style={{ borderRadius: 12, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <PlaceholderLine width={40} height={16} style={{ marginBottom: 8 }} />
              <PlaceholderLine width={60} height={20} />
            </View>
            <PlaceholderLine width={30} height={40} style={{ borderRadius: 20 }} />
          </View>
          <PlaceholderLine height={10} style={{ borderRadius: 5, marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <PlaceholderLine width={30} height={15} style={{ marginBottom: 0 }} />
            <PlaceholderLine width={50} height={15} style={{ marginBottom: 0 }} />
          </View>
        </Placeholder>
      </View>
    </OrderProgressWrapper>
  )
}
