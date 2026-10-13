import { Platform } from 'react-native'
import styled from 'styled-components/native'

export const PromotionsContainer = styled.View`
  width: 100%;
  margin-top: 20px;
`

export const WrapperSingleOffer = styled.View`
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 20px;
  background-color: ${(props: any) => props.theme.colors.white};

    /* iOS Shadow */
    ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.1);
  ` : ''}
`

export const SingleOfferContainer = styled.View`
  width: 100%;
  margin-bottom: 10px;
`

export const OfferInformation = styled.View`
  justify-content: space-between;
`

export const SearchBarContainer = styled.View`
  width: 100%;
`

export const SingleBusinessOffer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 15px;
      /* iOS Shadow */
      ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.1);
  ` : ''}
`

export const AvailableBusinesses = styled.View`
  flex-direction: row;
  overflow: hidden;
`

export const OfferData = styled.View`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
`

export const OfferHero = styled.View`
  align-items: center;
  margin-bottom: 16px;
`

export const OfferValueChip = styled.View`
  align-self: center;
  padding: 8px 14px;
  margin-bottom: 16px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.primary};
`

export const Code = styled.View`
  width: 100%;
  margin-bottom: 12px;
`

export const CouponHighlight = styled.View`
  width: 100%;
  align-items: center;
  padding: 18px 16px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-width: 1.5px;
  border-style: dashed;
  border-color: ${(props: any) => props.theme.colors.primary};
`

export const CouponCodeBadge = styled.View`
  margin-top: 10px;
  padding: 14px 22px;
  min-width: 80%;
  align-items: center;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.white};
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.primary};
`

export const OfferDescription = styled.View`
  width: 100%;
  margin-bottom: 16px;
  padding: 14px 16px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-left-width: 4px;
  border-left-color: ${(props: any) => props.theme.colors.primary};
`

export const OfferMetaList = styled.View`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 8px;
  padding: 4px 14px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const OfferMetaRow = styled.View<{ $isLast?: boolean }>`
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-width: ${(props: any) => (props.$isLast ? 0 : 1)}px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const ValueOfOffer = styled.View``

export const BusinessInfo = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`
