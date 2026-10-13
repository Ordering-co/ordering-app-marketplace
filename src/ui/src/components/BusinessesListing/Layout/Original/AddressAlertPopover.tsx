import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components/native';

import { PopoverContainer, Pointer, Bubble } from './styles';
import { OText, StoreMethods } from '@ui';

const { _retrieveStoreData, _setStoreData } = StoreMethods

export const AddressAlertPopover = ({ isVisible, text, setOpen }: any) => {
  const theme = useTheme();

  const [isPopoverVisible, setIsPopoverVisible] = useState(isVisible);

  const handleClose = (value: boolean) => {
    setOpen(value);
    setIsPopoverVisible(value);
    _setStoreData('showAwayAddressPopover', false);
  }

  useEffect(() => {
    const getInitialValues = async () => {
      const showAwayAddressPopover = await _retrieveStoreData('showAwayAddressPopover');
      setIsPopoverVisible(showAwayAddressPopover === false ? false : isVisible);
    }
    getInitialValues();
  }, [isVisible]);

  return (
    isPopoverVisible ? (
      <PopoverContainer activeOpacity={1} onPress={() => handleClose(!isPopoverVisible)}>
        <Pointer />
        <Bubble>
          <OText color={theme.colors.white} align='center'>{text}</OText>
        </Bubble>
      </PopoverContainer>
    ) : null);
};
