import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

export const Screen = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const Hero = styled.View`
  height: 248px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const HeroImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`

export const HeroShade = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 150px;
  background-color: rgba(0, 0, 0, 0.45);
`

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Identity = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  flex-direction: row;
  align-items: flex-end;
`

export const LogoFrame = styled.View`
  width: 64px;
  height: 64px;
  margin-right: 12px;
  border-radius: 14px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Logo = styled(FastImage)`
  width: 64px;
  height: 64px;
`

export const IdentityCopy = styled.View`
  flex: 1;
`

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
`

export const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`

export const Section = styled.View`
  padding: 20px 16px 8px;
`

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-horizontal: 16px;
`

export const CategoryCard = styled.View`
  width: 100%;
  margin-bottom: 14px;
  border-radius: 18px;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const CategoryImage = styled(FastImage)`
  width: 100%;
  height: 112px;
`

export const CategoryCaption = styled.View`
  min-height: 58px;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.backgroundCard || props.theme.colors.white};
`

export const CategoryCopy = styled.View`
  flex: 1;
  margin-right: 6px;
`

export const HeaderBack = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const ProductHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 16px 8px;
`

export const ProductHeaderCopy = styled.View`
  flex: 1;
  margin-left: 10px;
`

export const ProductCard = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 16px 12px;
  padding: 10px;
  border-radius: 18px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const ProductImage = styled(FastImage)`
  width: 72px;
  height: 72px;
  border-radius: 14px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const ProductCopy = styled.View`
  flex: 1;
  margin-horizontal: 12px;
`

export const SkeletonCard = styled.View`
  width: 48%;
  margin-bottom: 14px;
  border-radius: 18px;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const SkeletonCaption = styled.View`
  min-height: 58px;
  padding: 12px;
  justify-content: center;
`

export const SkeletonProduct = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 16px 12px;
  padding: 10px;
  border-radius: 18px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const AddButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
`
