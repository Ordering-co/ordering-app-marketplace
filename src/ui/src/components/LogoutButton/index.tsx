import React from 'react';

import { LogoutAction, useEvent } from '@components';
import { StoreMethods } from '@ui';

const { _removeStoreData, _retrieveStoreData } = StoreMethods

export const emitLogoutSuccess = async (events: any) => {
  await _removeStoreData('showAwayAddressPopover')
  events.emit('logout')
}

const LogoutButtonUI = (props: any) => {
  const { UIButton, handleLogoutClick, uiProps } = props

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    handleLogoutClick(data)
  };

  return (
    <>
      {UIButton &&
        <UIButton
          {...uiProps}
          onPress={() => handleClick()}
        />
      }
    </>
  )
}

export const LogoutButton = (props: any) => {
  const [events] = useEvent()

  const logoutProps = {
    ...props,
    isNative: true,
    UIComponent: LogoutButtonUI,
    handleSuccessLogout: () => emitLogoutSuccess(events)
  }
  return (
    <LogoutAction {...logoutProps} />
  )
}
