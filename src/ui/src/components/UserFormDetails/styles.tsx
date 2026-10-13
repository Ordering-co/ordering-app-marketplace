import styled from 'styled-components/native';

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const UDForm = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`

export const UDWrapper = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`

export const UDLoader = styled.View`
  width: 100%;
  justify-content: center;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin-top: 0px;
`

export const WrapperPhone = styled.View`
  margin-bottom: 25px;
  width: 100%;
`

export const WrapperBirthdate = styled.View`
  justify-content: center;
  width: 100%;
  height: 55px;
  border-radius: 15px;
  border-width: 1px;
  border-color: ${androidBorderColor};
  background-color: ${(props: any) => props.theme.colors.white};
  padding-horizontal: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`
