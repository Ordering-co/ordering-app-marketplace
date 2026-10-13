import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';

interface BusinessCardSkeletonProps {
  count?: number;
  style?: any;
}

const BusinessCardSkeleton: React.FC<BusinessCardSkeletonProps> = ({
  count = 1,
  style
}) => {
  const theme = useTheme();

  const renderSkeleton = (index: number) => (
    <View key={index} style={[styles.container, { backgroundColor: theme.colors.white }, style]}>
      <Placeholder>
        <View style={styles.cardContent}>
          <View style={styles.contentArea}>
            <PlaceholderLine
              width={70}
              height={18}
              style={styles.restaurantName}
            />
            <View style={styles.timeDistanceRow}>
              <PlaceholderLine
                width={30}
                height={12}
                style={styles.timeText}
              />
              <PlaceholderLine
                width={40}
                height={12}
                style={styles.distanceText}
              />
            </View>
            <View style={styles.deliveryOptionsRow}>
              <View style={styles.deliveryOption}>
                <PlaceholderLine
                  width={50}
                  height={12}
                  style={styles.deliveryLabel}
                />
                <PlaceholderLine
                  width={35}
                  height={12}
                  style={styles.deliveryPrice}
                />
              </View>
            </View>
            <PlaceholderLine
              width={100}
              height={40}
              style={styles.orderButton}
            />
          </View>
          <PlaceholderMedia
            style={styles.heartIcon}
          />
        </View>
      </Placeholder>
    </View>
  );

  return (
    <>
      {Array.from({ length: count }, (_, index) => renderSkeleton(index))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  contentArea: {
    flex: 1,
    paddingRight: 8,
  },
  restaurantName: {
    marginBottom: 8,
    borderRadius: 4,
  },
  timeDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginRight: 12,
    borderRadius: 4,
  },
  distanceText: {
    borderRadius: 4,
  },
  deliveryOptionsRow: {
    marginBottom: 16,
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  deliveryLabel: {
    borderRadius: 4,
  },
  deliveryPrice: {
    borderRadius: 4,
  },
  orderButton: {
    borderRadius: 25,
    alignSelf: 'stretch',
  },
  heartIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default BusinessCardSkeleton;
