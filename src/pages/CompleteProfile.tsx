import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { ToastType, useLanguage, useSession, useToast } from '@components';
import { OIcon, OText, UserDetails } from '@ui';
import { useProfileCompletion } from '../contexts/CheckoutFieldsContext';

const CompleteProfile = () => {
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ user }, { logout, refreshUserInfo }] = useSession();
  const [, { showToast }] = useToast();
  const { missingFields, checkoutFields, canSkip, skip } = useProfileCompletion();

  // The cached session user can be stale (e.g. the field was saved from another session),
  // so pull the server truth once on mount; if it already satisfies the gate, it clears.
  const didRefresh = useRef(false);
  useEffect(() => {
    if (didRefresh.current) return;
    didRefresh.current = true;
    refreshUserInfo?.();
  }, [refreshUserInfo]);

  // Logout is the only way out of this screen, so a silent failure would strand the user.
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      showToast(ToastType.Error, err?.message || t('ERROR_UNKNOWN', 'An error occurred'));
    }
  };

  // UserFormDetails leaves edit mode after any successful save and offers no way back in,
  // so remount it whenever the user changes to keep the form editable until the gate clears.
  const [remountCount, setRemountCount] = useState(0);
  useEffect(() => {
    setRemountCount(count => count + 1);
  }, [user]);
  const userDetailsKey = `${remountCount}-${missingFields.join('|')}`;

  const [phoneUpdate, setPhoneUpdate] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPage,
    },
    scrollContent: {
      padding: 20,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    titleText: {
      flex: 1,
    },
    descriptionText: {
      paddingVertical: 20,
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <OText size={22} weight="bold" style={styles.titleText}>
            {t('COMPLETE_YOUR_PROFILE', 'Complete your profile')}
          </OText>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <OIcon src={theme.images.general.logout} width={20} color={theme.colors.textNormal} />
          </TouchableOpacity>
        </View>

        <OText size={14} color={theme.colors.disabled} style={styles.descriptionText}>
          {t(
            'COMPLETE_YOUR_PROFILE_MESSAGE',
            'In order to continue using our platform please complete your profile information',
          )}
        </OText>

        <UserDetails
          key={userDetailsKey}
          isEdit
          isUserDetailsEdit
          useSessionUser
          useDefualtSessionManager
          isOrderTypeValidationField
          isCheckoutPlace
          hideUpdateButton
          requiredFields={missingFields}
          checkoutFields={checkoutFields}
          phoneUpdate={phoneUpdate}
          togglePhoneUpdate={setPhoneUpdate}
          onClose={() => {}}
        />

        {canSkip && (
          <TouchableOpacity onPress={skip} activeOpacity={0.7} style={styles.skipButton}>
            <OText size={14} color={theme.colors.primary}>
              {t('SKIP_FOR_NOW', 'Skip for now')}
            </OText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompleteProfile;
