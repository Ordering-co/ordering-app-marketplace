import React from 'react';
import { TouchableOpacity } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { useSession, useToast } from '@components';
import { useProfileCompletion } from '../../contexts/CheckoutFieldsContext';
import { renderPage } from '../../../jest/helpers/renderPage';
import CompleteProfile from '../CompleteProfile';

jest.mock('@ui', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ...require('../../../jest/helpers/mockUi'),
    UserDetails: (props: any) => <View testID="user-details" {...props} />,
  };
});

jest.mock('../../contexts/CheckoutFieldsContext', () => ({
  useProfileCompletion: jest.fn(),
}));

const themeOverrides = { images: { general: { logout: 'logout.png' } } };

const setProfile = (over: any = {}) => {
  (useProfileCompletion as jest.Mock).mockReturnValue({
    missingFields: ['name'],
    checkoutFields: [{ order_type_id: 1, enabled: true, required: true, validation_field: { code: 'name' } }],
    canSkip: false,
    skip: jest.fn(),
    ...over,
  });
};

describe('CompleteProfile (smoke)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue([{ user: { id: 1 } }, { logout: jest.fn(), login: jest.fn(), refreshUserInfo: jest.fn() }]);
    setProfile();
  });

  it('refresca el user del servidor al montar (evita bloquear con datos obsoletos)', () => {
    const refreshUserInfo = jest.fn();
    (useSession as jest.Mock).mockReturnValue([{ user: { id: 1 } }, { logout: jest.fn(), login: jest.fn(), refreshUserInfo }]);
    renderPage(CompleteProfile, { themeOverrides } as any);
    expect(refreshUserInfo).toHaveBeenCalledTimes(1);
  });

  it('renderiza el título y reenvía requiredFields/checkoutFields a UserDetails', () => {
    const { getByTestId, getAllByTestId } = renderPage(CompleteProfile, { themeOverrides } as any);
    expect(getAllByTestId('o-text').length).toBeGreaterThan(0);
    const userDetails = getByTestId('user-details');
    expect(userDetails.props.requiredFields).toEqual(['name']);
    expect(userDetails.props.isCheckoutPlace).toBe(true);
  });

  it('muestra "Skip for now" solo cuando canSkip es true', () => {
    const skip = jest.fn();
    const { getByText } = renderPage(CompleteProfile, { themeOverrides } as any);
    expect(() => getByText('Skip for now')).toThrow();

    setProfile({ canSkip: true, skip });
    const { getByText: getByText2 } = renderPage(CompleteProfile, { themeOverrides } as any);
    fireEvent.press(getByText2('Skip for now'));
    expect(skip).toHaveBeenCalled();
  });

  it('logout es la salida: al pulsarlo llama logout()', () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    (useSession as jest.Mock).mockReturnValue([{ user: { id: 1 } }, { logout, login: jest.fn() }]);
    const { UNSAFE_getAllByType } = renderPage(CompleteProfile, { themeOverrides } as any);
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[0]);
    expect(logout).toHaveBeenCalled();
  });

  it('si logout falla, muestra un toast en vez de dejar el botón mudo', async () => {
    const showToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue([, { showToast }]);
    const logout = jest.fn().mockRejectedValue(new Error('storage error'));
    (useSession as jest.Mock).mockReturnValue([{ user: { id: 1 } }, { logout, login: jest.fn() }]);

    const { UNSAFE_getAllByType } = renderPage(CompleteProfile, { themeOverrides } as any);
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[0]);

    await waitFor(() => expect(showToast).toHaveBeenCalled());
  });
});
