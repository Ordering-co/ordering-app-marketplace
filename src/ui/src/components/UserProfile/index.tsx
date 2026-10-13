import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';

import Icon from 'react-native-vector-icons/Ionicons';

import { ProfileParams } from '../../types';

import {
  Container,
  ListItemContent,
  ListItemStyle,
  QuickActionButtonStyle,
  QuickActionsContainer,
  Section,
  WrapperIcon,
  WrapperOptions
} from './styles';

import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
  ToastType,
  useToast,
  useConfig,
  useUtils,
  useApi,
  useEvent
} from '@components';
import { useSavedCardsGateway } from '../SavedCards/useSavedCardsGateway';
import { emitLogoutSuccess } from '../LogoutButton';

import {
  OAlertOriginal as OAlert,
  OText,
  LogoutButton,
  WebsocketStatus
} from '@ui'

const ProfileListUI = (props: ProfileParams) => {
  const {
    notificationsGroup,
    handleRemoveAccount,
    removeAccountState,
    goToBack,
    onNavigationRedirect,
    appVersion,
    wallets,
    isWalletPointsEnabled
  } = props;

  const theme = useTheme();
  const [ordering] = useApi();
  const [, { logout }] = useSession();
  const [events] = useEvent();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const { isAvailable: savedCardsAvailable } = useSavedCardsGateway();
  const [, { showToast }] = useToast();
  const { errors } = useForm();
  const [{ parsePrice, isWalletEnabled: isWalletConfigEnabled }] = useUtils();

  // Number of enabled languages — drives whether the Languages row is shown.
  const [languagesCount, setLanguagesCount] = useState(0);

  const isProjectEnterpricePlan = configs?.plan_enterprise && configs?.plan_enterprise?.value
  const hideWallet = theme?.profile?.components?.wallet?.hidden
  const hideMessages = theme?.bar_menu?.components?.messages?.hidden
  const hideHelp = theme?.bar_menu?.components?.help?.hidden
  const hideSession = theme?.bar_menu?.components?.sessions?.hidden || !isProjectEnterpricePlan
  const showLanguages = theme?.profile?.components?.languages?.hidden
  const showNotifications = !theme?.profile?.components?.notification_settings?.hidden

  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs)
  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false
  const showCashWallet = isWalletEnabled && !hideWallet
  const showLoyaltyPoints = isWalletPointsEnabled && !hideWallet
  const showRewards = showCashWallet || showLoyaltyPoints || !isGiftCardDisabled

  useEffect(() => {
    let mounted = true;
    const fetchLanguagesCount = async () => {
      try {
        const { content: { error, result } } = await ordering.languages().where([{ attribute: 'enabled', value: true }]).get();
        if (mounted && !error && Array.isArray(result)) setLanguagesCount(result.length);
      } catch {
        // keep languagesCount at 0 → Languages row stays hidden on failure
      }
    };
    fetchLanguagesCount();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notificationsGroup.result.result && !notificationsGroup.loading) {
      if (!notificationsGroup.result?.error) {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [notificationsGroup.result])

  useEffect(() => {
    const errorMessages = Object.values(errors).map((item: any) => `- ${item.message}`).join('\n');

    if (errorMessages) {
      showToast(ToastType.Error, errorMessages);
    }
  }, [errors]);

  const detailProps = {
    goToBack,
    onNavigationRedirect,
    handleRemoveAccount,
  }

  useEffect(() => {
    if (removeAccountState?.result === 'OK') {
      logout().then(() => emitLogoutSuccess(events))
    }
  }, [removeAccountState])

  const ListItem = ({
    iconName,
    text,
    value,
    onPress,
    children
  }: any) => (
    <ListItemStyle onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <ListItemContent>
        <Icon name={iconName} size={24} color={theme.colors.black} style={styles.listItemIcon} />
        <OText style={styles.listItemText}>{text}</OText>
      </ListItemContent>
      {value && <OText style={styles.listItemValue}>{value}</OText>}
      {children}
    </ListItemStyle>
  );

  const QuickActionButton = ({ iconName, text, onPress, color, size }: any) => (
    <QuickActionButtonStyle onPress={onPress} activeOpacity={0.7}>
      <WrapperIcon>
        <Icon name={iconName} size={size ?? 28} color={color ?? theme.colors.black} />
      </WrapperIcon>
      <OText style={{ marginTop: 6 }} weight={'500'}>{text}</OText>
    </QuickActionButtonStyle>
  );

  return (
    <Container>
      <Spinner visible={notificationsGroup?.loading} />

      <WrapperOptions
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <QuickActionsContainer>
          <QuickActionButton iconName="heart-outline" text={t('MY_FAVORITES', 'My Favorites')} onPress={() => onNavigationRedirect('Favorite')} />
          {savedCardsAvailable
            ? <QuickActionButton iconName="card-outline" text={t('MY_CARDS', 'My cards')} onPress={() => onNavigationRedirect('SavedCards')} />
            : <QuickActionButton iconName="location-outline" text={t('ADDRESSES', 'Addresses')} onPress={() => onNavigationRedirect('AddressList', { isGoBack: true })} />}
          <QuickActionButton iconName="person-outline" text={t('MY_ACCOUNT', 'My Account')} onPress={() => onNavigationRedirect('ProfileForm', { ...detailProps })} />
        </QuickActionsContainer>

        {showRewards && (
          <Section>
            <OText size={theme.utils.tsize.m + 2} style={styles.sectionTitle}>{t('REWARDS', 'Rewards')}</OText>
            {showCashWallet && (
              <ListItem iconName="cash-outline" text={t('CASH_WALLET', 'Cash Wallet')} value={`${parsePrice(wallets.result?.result?.cash?.balance ?? 0)}`} onPress={() => onNavigationRedirect('CashWallet')} />
            )}
            {showLoyaltyPoints && (
              <ListItem iconName="ribbon-outline" text={t('LOYALTY_POINTS', 'Loyalty Points')} value={`${wallets.result?.result?.points?.balance ?? 0} ${t('POINTS', 'points')}`} onPress={() => onNavigationRedirect('LoyaltyPoints')} />
            )}
            {!isGiftCardDisabled && (
              <ListItem iconName="gift-outline" text={t('GIFT_CARDS', 'Gift Cards')} onPress={() => onNavigationRedirect('GiftCards')} />
            )}
          </Section>
        )}

        <Section>
          <OText size={theme.utils.tsize.m + 2} style={styles.sectionTitle}>{t('MY_ACCOUNT', 'My account')}</OText>
          {savedCardsAvailable && (
            <ListItem iconName="location-outline" text={t('ADDRESSES', 'Addresses')} onPress={() => onNavigationRedirect('AddressList', { isGoBack: true })} />
          )}
          {configs?.school_module_enabled?.value === '1' && (
            <ListItem iconName="school-outline" text={t('SCHOOL_MY_STUDENTS', 'My students')} onPress={() => onNavigationRedirect('MyStudents')} />
          )}
          {!hideMessages && (
            <ListItem iconName="chatbubbles-outline" text={t('MESSAGES', 'Messages')} onPress={() => onNavigationRedirect('Messages')} />
          )}
          {!showLanguages && languagesCount > 1 && (
            <ListItem iconName="language-outline" text={t('LANGUAGES', 'Languages')} onPress={() => onNavigationRedirect('Languages')} />
          )}
          {showNotifications && (
            <ListItem iconName="notifications-outline" text={t('NOTIFICATIONS', 'Notifications')} onPress={() => onNavigationRedirect('Notifications')} />
          )}
        </Section>

        <Section style={{ marginBottom: 20 }}>
          <OText size={theme.utils.tsize.m + 2} style={styles.sectionTitle}>{t('INFORMATION', 'Information')}</OText>
          {!hideHelp && (
            <ListItem iconName="help-circle-outline" text={t('HELP', 'Help')} onPress={() => onNavigationRedirect('Help')} />
          )}
          {!hideSession && (
            <ListItem iconName="shield-checkmark-outline" text={t('SECURITY', 'Security')} onPress={() => onNavigationRedirect('Sessions')} />
          )}
          <LogoutButton
            UIButton={ListItem}
            uiProps={{
              iconName: 'log-out-outline',
              text: t('LOGOUT', 'Logout')
            }}
          />
        </Section>
        <WebsocketStatus />
        {appVersion && (
          <View style={{ alignItems: 'center' }}>
            <OText>{`v${appVersion}`}</OText>
          </View>
        )}
      </WrapperOptions>
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: 80
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  listItemIcon: {
    marginRight: 18,
  },
  listItemText: {
    fontSize: 16,
    flexShrink: 1
  },
  listItemValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export const UserProfile = (props: any) => {
  const [{ configs }] = useConfig()
  const profileProps = {
    ...props,
    UIComponent: ProfileListUI,
    isWalletCashEnabled: configs?.wallet_cash_enabled?.value === '1',
    isWalletPointsEnabled: configs?.wallet_credit_point_enabled?.value === '1'
  };
  return <UserProfileController {...profileProps} />;
};
