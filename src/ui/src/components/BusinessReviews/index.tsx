import React, { useEffect } from 'react';
import moment from 'moment';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

import { BusinessReviewsParams } from '../../types';
import { setLocalMoment } from '../../utils';
import { ReviewItem } from './Item';

import { BusinessReviewsContainer, BusinessReviewContent, ReviewSummaryContainer, RankingIconContainer, RatingValueContainer } from './styles';

import { BusinessReviews as BusinessReviewController, useLanguage } from '@components';
import { OText } from '@ui';

const BusinessReviewsUI = (props: BusinessReviewsParams) => {
  const { reviewsList, businessState } = props;
  const [, t] = useLanguage();
  const theme = useTheme();

  const averageRating = businessState?.business?.reviews?.total

  useEffect(() => {
    setLocalMoment(moment, t)
  }, [])

  return (
    <BusinessReviewsContainer>
      {typeof averageRating === 'number' && (
        <ReviewSummaryContainer>
          <RankingIconContainer>
            <FastImage
              style={{ width: 120, height: 120 }}
              source={theme.images.general.ranking}
              resizeMode={FastImage.resizeMode.cover}
            />
          </RankingIconContainer>
          <RatingValueContainer>
            <OText size={60} weight={'bold'}>{averageRating.toFixed(1)}</OText>
            <OText>{t('OF_THE_5_0', 'of the 5.0')}</OText>
          </RatingValueContainer>
        </ReviewSummaryContainer>
      )}
      <BusinessReviewContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 80 }}>
        {reviewsList.error ? (
          <OText size={16}>{t('ERROR_UNKNOWN', 'An error has occurred')}</OText>
        ) : (
          <>
            {reviewsList?.reviews.map((review: any) => (
              <ReviewItem
                key={`review_key_${review.id}`}
                total={review?.total}
                comment={review?.comment}
                created_at={review?.created_at}
              />
            ))}
          </>
        )}
        {reviewsList?.reviews.length === 0 && (
          <OText>{t('REVIEWS_NOT_FOUND', 'Reviews Not Found')}</OText>
        )}
      </BusinessReviewContent>
    </BusinessReviewsContainer>
  );
};

export const BusinessReviews = (props: any) => {
  const BusinessReviewProps = {
    ...props,
    UIComponent: BusinessReviewsUI,
  };
  return <BusinessReviewController {...BusinessReviewProps} />;
};
