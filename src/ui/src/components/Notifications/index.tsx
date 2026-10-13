import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native';
import { useTheme } from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  ScreenContainer,
  ContentContainer,
  SettingsWrapper,
  SettingItem,
} from './styles';

import {
  UserFormDetails as NotificationsController,
  useLanguage,
  useSession,
  useToast,
  ToastType,
} from '@components';

import { OText } from '@ui';

const NotificationsUI = (props: any) => {
  const {
    singleNotifications,
    handleChangePromotions,
    userData
  } = props;

  const theme = useTheme();
  const [{ user: userSession }] = useSession();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();

  const user = userData || userSession;
  const showCustomerPromotions = !theme?.profile?.components?.promotions?.hidden
  const showNotifications = !theme?.profile?.components?.notification_settings?.hidden

  const notificationOptions = [
    { key: 'sms', label: t('SMS', 'SMS') },
    { key: 'email', label: t('EMAILS', 'Emails') },
    { key: 'notification', label: t('PUSH_NOTIFICATIONS', 'Push notifications') },
  ];

  const getInitialSetting = (settingKey: any, newsletterPath: any) => {
    if (singleNotifications?.result?.result?.settings?.[settingKey]) {
      return !!singleNotifications.result.result.settings[settingKey][newsletterPath];
    }
    if (singleNotifications?.changes?.settings?.[settingKey]) {
      return !!singleNotifications.changes.settings[settingKey][newsletterPath];
    }
    if (user?.settings?.[settingKey]) {
      return !!user.settings[settingKey][newsletterPath];
    }
    return false;
  };

  const [notificationsList, setNotificationsList] = useState<any>({
    email: getInitialSetting('email', 'newsletter'),
    sms: getInitialSetting('sms', 'newsletter'),
    notification: getInitialSetting('notification', 'newsletter')
  });

  const handleEditNotifications = (key: any, value: any) => {
    setNotificationsList((prevList: any) => ({
      ...prevList,
      [key]: value
    }));
  };

  useEffect(() => {
    if (singleNotifications.result.result && !singleNotifications.loading) {
      if (!singleNotifications.result?.error) {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [singleNotifications.result])

  useEffect(() => {
    const isSingle = true
    handleChangePromotions(notificationsList, isSingle)
  }, [notificationsList])

  return (
    <ScreenContainer>
      <ContentContainer>
        {showCustomerPromotions && showNotifications && (
          <>
            <Spinner visible={singleNotifications?.loading} />
            <SettingsWrapper>
              <OText style={{ marginBottom: 24, fontSize: 16, lineHeight: 22, color: theme.colors.textSecondary || '#555555' }}>
                {t('NOTIFICATIONS_TEXT_TITLE', 'Set up promotional notifications you would like to receive from Ordering')}
              </OText>
              {notificationOptions.map((option) => (
                <SettingItem key={option.key}>
                  <OText size={theme.utils.tsize.m} weight={'500'}>{option.label}</OText>
                  <Switch
                    trackColor={{ false: theme.colors.disabled, true: theme.colors.active }}
                    thumbColor={theme.colors.white}
                    style={{ borderBlockColor: theme.colors.black }}
                    ios_backgroundColor={theme.colors.white}
                    onValueChange={(value) => handleEditNotifications(option.key, value)}
                    value={notificationsList[option.key]}
                    disabled={singleNotifications?.loading}
                  />
                </SettingItem>
              ))}
            </SettingsWrapper>
          </>
        )}
      </ContentContainer>
    </ScreenContainer>
  );
};

export const NotificationsList = (props: any) => {
  const notificationsListProps = {
    ...props,
    UIComponent: NotificationsUI
  };
  return <NotificationsController {...notificationsListProps} />;
};

