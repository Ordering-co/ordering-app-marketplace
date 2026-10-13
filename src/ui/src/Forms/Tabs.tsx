import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'styled-components/native'
import { StyleSheet, ScrollView, Dimensions } from 'react-native';

import { OTabs, OTab } from './styles'

import { useLanguage } from '@components'
const { width: screenWidth } = Dimensions.get('window');
import { OText } from '@ui'

export const Tabs = (props: any) => {
  const {
    defaultTab,
    isOtpEmail,
    defaultTabs,
    setFullItemAfterClick,
    isOtpCellphone,
    useLoginByEmail,
    useLoginByCellphone,
    useOtpEmail,
    useOtpCellphone,
    handleChangeTab,
    handleChangeOtpType
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const tabs = defaultTabs ?? [
    { tab: 'email', type: 'email', enabled: useLoginByEmail, text: t('LOGIN_BY_EMAIL', 'By Email') },
    { tab: 'cellphone', type: 'cellphone', enabled: useLoginByCellphone, text: t('LOGIN_BY_PHONE', 'By Phone') },
    { tab: 'email', type: 'otp_email', enabled: useOtpEmail, text: t('LOGIN_BY_OTP_EMAIL', 'By OTP Email'), condition: isOtpEmail },
    { tab: 'cellphone', type: 'otp_cellphone', enabled: useOtpCellphone, text: t('LOGIN_BY_OTP_PHONE', 'By OTP Phone'), condition: isOtpCellphone }
  ]

  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollViewRef = useRef<any>(null);
  const [buttonWidths, setButtonWidths] = useState([]);

  const handlePress = (index: any) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (scrollViewRef.current && buttonWidths.length > selectedIndex && buttonWidths[selectedIndex]) {
      let scrollX = 0;
      for (let i = 0; i < selectedIndex; i++) {
        scrollX += buttonWidths[i] + 10; // Consider the margin
      }

      const selectedButtonWidth = buttonWidths[selectedIndex] + 10;
      const centerPosition = scrollX - (screenWidth / 2) + (selectedButtonWidth / 2);

      scrollViewRef.current.scrollTo({ x: Math.max(0, centerPosition), animated: true });
    }
  }, [selectedIndex, buttonWidths]);

  const onButtonLayout = (event: any, index: any) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidths(prevWidths => {
      const newWidths: any = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  };

  useEffect(() => {
    const defaultTabIndex = defaultTabs?.findIndex((t: any) => t.id?.toString() === defaultTab.replace('cat_', ''))
    if (defaultTabIndex !== -1) {
      setSelectedIndex(defaultTabIndex)
    }
  }, [defaultTab])

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <OTabs>
        {tabs.filter((t: any) => t.enabled).map((tab: any, index: any) => {
          const selected = tab?.condition ?? defaultTab === tab.type
          return (
            <OTab
              key={index}
              bgColorSelected={props.bgColorSelected}
              selected={selected}
              onPress={() => {
                handlePress(index)
                tab.type?.includes?.('otp') && handleChangeOtpType
                  ? handleChangeOtpType(tab.tab)
                  : handleChangeTab(setFullItemAfterClick ? tab : tab.type)
              }}
              onLayout={(event: any) => onButtonLayout(event, index)}
            >
              <OText
                color={selected ? (props.textColorSelected ?? theme.colors.active) : (props.textColorUnselected ?? theme.colors.disabled)}
                weight='bold'
              >
                {tab.text}
              </OText>
            </OTab>
          )
        })}
      </OTabs>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  }
});
