import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { View } from 'react-native';

export const CouponCardSkeleton = () => {
  const theme = useTheme();

  const lineStyle = {
    borderRadius: 4,
  };

  return (
    <Placeholder
      Animation={Fade}
      style={{
        borderRadius: theme.utils.radius.l,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <PlaceholderLine height={12} width={40} style={{ ...lineStyle, marginBottom: 10 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0 }}>
        <View style={{ flex: 1, marginRight: 15, marginTop: 20 }}>
          <PlaceholderLine height={18} width={80} style={{ ...lineStyle, marginBottom: 0 }} />
        </View>
        <PlaceholderLine height={60} width={20} style={{ ...lineStyle, borderRadius: theme.utils.radius.m, marginBottom: 20 }} />
      </View>

      <View style={{ flexDirection: 'row', overflow: 'hidden', marginBottom: 15 }}>
        {[...Array(20)].map((_, i) => (
          <View key={i} style={{ height: 1, width: 10, backgroundColor: theme.colors.border, marginRight: 5 }} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <PlaceholderLine height={12} width={30} style={lineStyle} />
        <PlaceholderLine height={36} width={35} style={{ ...lineStyle, borderRadius: 8, marginBottom: 0 }} />
      </View>
    </Placeholder>
  );
};
