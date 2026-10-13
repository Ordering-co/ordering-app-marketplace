import { useLanguage, useUtils } from "@components";
import { OText } from "@ui";
import { HeaderItem, ReviewItemContainer, StarPointsView } from "./styles";

const renderStars = (total: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <OText key={i} style={{ color: i < total ? 'black' : '#E9ECEF' }}>
        ★
      </OText>
    );
  }
  return stars;
};

export const ReviewItem = ({ total, comment, created_at }: any) => {
  const [{ parseDate }] = useUtils();
  const [, t] = useLanguage();

  return (
    <ReviewItemContainer>
      <HeaderItem>
        <StarPointsView>
          {renderStars(total)}
        </StarPointsView>
        <OText>
          {parseDate(created_at, { outputFormat: 'MMMM D, YYYY • hh:mm A' })}
        </OText>
      </HeaderItem>
      <OText>{comment || t('NO_COMMENT', 'No comment')}</OText>
    </ReviewItemContainer>
  );
};
