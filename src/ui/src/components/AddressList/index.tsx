import React, { useState, useMemo, useEffect } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { TouchableRipple } from 'react-native-paper'
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Icon2 from 'react-native-vector-icons/Ionicons';

import { AddressListParams } from '../../types'
import { TagOptions } from './TagOptions'
import { AddressItem, Container, WrapperIconActions } from './styles'
import { AddressList as AddressListController, useLanguage, useOrder, useEvent } from '@components'
import { OButton, OText, OAlert, NotFoundSource, OInput } from '@ui'
import { runSetDefaultThenNavigate } from './shouldNavigateAfterSetDefault'

const AddressListUI = (props: AddressListParams) => {
  const {
    route,
    addressList,
    isFromProfile,
    handleSetDefault,
    handleDelete,
    setAddressList,
    isGoBack,
    isFromBusinesses,
    isFromProductsList,
    afterSignup,
    loadAddresses,
    goToBack,
    onNavigationRedirect
  } = props

  const theme = useTheme();

  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const [refreshing] = useState(false);
  const [events] = useEvent()
  const [isLogin, setIsLogin] = useState(false)

  const [isProfile, setIsProfile] = useState(isFromProfile || route?.params?.isFromProfile);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const onNavigatorRedirect = () => {
    if (route && (isFromBusinesses || isGoBack)) {
      isGoBack ? goToBack?.() : onNavigationRedirect('BottomTab')
      return
    }
    if (route && route?.params?.isFromCheckout) {
      onNavigationRedirect('CheckoutPage', { cartUuid: route?.params?.cartUuid })
      return
    }
    if (route && !route?.params?.isFromCheckout) {
      onNavigationRedirect('BottomTab')
    }
  }

  const uniqueAddressesList = useMemo(() => (
    (addressList.addresses && addressList.addresses
      .filter(
        (address: any, i: number, self: any) => address.address &&
          i === self.findIndex((obj: any) => (
            address.address === obj.address &&
            address.address_notes === obj.address_notes &&
            address.zipcode === obj.zipcode &&
            address.internal_number === obj.internal_number
          ))
      )
      .sort((a: any, b: any) => (b.default === true ? 1 : 0) - (a.default === true ? 1 : 0))
    ) || []
  ), [addressList.addresses]);

  const filteredAddressesList = useMemo(() => {
    let list = uniqueAddressesList;
    if (searchValue) {
      list = list.filter((address: any) =>
        address.address?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (selectedTag) {
      list = list.filter((address: any) =>
        (address.tag || 'other') === selectedTag
      );
    }
    return list;
  }, [uniqueAddressesList, searchValue, selectedTag]);

  const checkAddress = (address: any) => {
    if (!orderState?.options?.address) return false
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
    const values: any = []
    props.forEach(prop => {
      if (address[prop]) {
        if (prop === 'location') {
          values.push(address[prop].lat === orderState?.options?.address[prop]?.lat &&
            address[prop].lng === orderState?.options?.address[prop]?.lng)
        } else {
          values.push(address[prop] === orderState?.options?.address[prop])
        }
      } else {
        values.push(orderState?.options?.address[prop] === null || orderState?.options?.address[prop] === '')
      }
    })
    return values.every((value: any) => value)
  }

  const handleSetAddress = async (address: any) => {
    if (address.id === orderState?.options?.address_id) return
    await runSetDefaultThenNavigate({
      setDefault: () => handleSetDefault(address),
      navigate: onNavigatorRedirect
    })
  }

  const handleSaveAddress = (address: any) => {
    let found = false
    const addresses = addressList.addresses.map((_address: any) => {
      if (_address?.id === address?.id) {
        Object.assign(_address, address)
        found = true
      } else if (address.default) {
        _address.default = false
      }
      return _address
    })
    if (!found) {
      addresses.push(address)
    }
    setAddressList({
      ...addressList,
      addresses
    })
  }

  const handleOnRefresh = () => {
    if (!addressList.loading) {
      loadAddresses && loadAddresses();
    }
  }

  useEffect(() => {
    events.on('login', setIsLogin)
    return () => {
      events.off('login', setIsLogin)
    }
  }, [])

  return (
    <Container
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }
    >
      {addressList.loading && (
        <>
          {[...Array(8)].map((_, i) => (
            <Placeholder
              key={i}
              Animation={Fade}
              style={{ paddingVertical: 10 }}
            >
              <View>
                <PlaceholderLine width={80} height={14} style={{ marginBottom: 6 }} />
                <PlaceholderLine width={60} height={14} style={{ marginBottom: 0 }} />
              </View>
            </Placeholder>
          ))}
        </>
      )}

      {(!addressList.loading || (isFromProductsList || isFromBusinesses || isFromProfile || isProfile)) && (
        <>
          {!addressList.error &&
            addressList?.addresses?.length > 0 && (
              <View>
                {/* <OInput
                  placeholder={t('SEARCH_ADDRESS', 'Search address')}
                  value={searchValue}
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChange={setSearchValue}
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.textSecondary}
                /> */}

                <TagOptions selectedTag={selectedTag} setSelectedTag={setSelectedTag} />

                <OText weight={600} size={theme.utils.tsize.m}>
                  {t('SAVED_ADDRESSES', 'Saved addresses')}
                </OText>
                {filteredAddressesList.length > 0 ? (
                  filteredAddressesList.map((address: any) => (
                    <AddressItem
                      key={address.id}
                      isSelected={checkAddress(address)}
                      onPress={() => handleSetAddress(address)}
                    >
                      <Icon2
                        name='location-sharp'
                        size={24}
                        color={checkAddress(address) ? theme.colors.active : theme.colors.primary}
                        style={{ marginRight: 5 }}
                      />
                      <OText
                        style={{
                          ...styles.address,
                          color: checkAddress(address) ? theme.colors.active : theme.colors.primary
                        }}
                        size={12}
                        weight={600}
                      >
                        {address.address}
                      </OText>
                      <TouchableRipple
                        onPress={() => onNavigationRedirect(
                          'AddressForm',
                          {
                            address: address,
                            isEditing: true,
                            addressesList: addressList,
                            onSaveAddress: handleSaveAddress,
                            isSelectedAfterAdd: true,
                            isFromProductsList: isFromProductsList,
                            hasAddressDefault: !!orderState.options?.address?.location,
                            isFromCheckout: route?.params?.isFromCheckout
                          }
                        )}
                      >
                        <WrapperIconActions>
                          <Icon name='pencil' size={16} color={theme.colors.textNormal} />
                        </WrapperIconActions>
                      </TouchableRipple>
                      {!checkAddress(address) && (
                        <OAlert
                          title={t('DELETE_ADDRESS', 'Delete Address')}
                          message={t('QUESTION_DELETE_ADDRESS', 'Are you sure to you wants delete the selected address')}
                          onAccept={() => handleDelete(address)}
                          disabled={checkAddress(address)}
                        >
                          <WrapperIconActions>
                            <Icon name='trash' size={16} color={theme.colors.textNormal} />
                          </WrapperIconActions>
                        </OAlert>
                      )}
                    </AddressItem>
                  ))
                ) : (
                  <NotFoundSource
                    content={t('NO_ADDRESSES_FOUND', 'No addresses found')}
                  />
                )}
              </View>
            )}

          {!addressList.loading && addressList.error && (
            addressList.error.length > 0 && (
              <NotFoundSource
                content={
                  addressList.error[0]?.message ||
                  addressList.error[0] ||
                  t('NETWORK_ERROR', 'Network Error, please reload the app')
                }
              />
            )
          )}

          {!addressList.loading && !addressList.error && (
            <>
              {addressList?.addresses?.length === 0 && (
                <NotFoundSource
                  iconName='location-outline'
                  content={t('NO_ADDRESSES_SAVED', 'No addresses saved yet')}
                />
              )}

              <OButton
                text={t('ADD_NEW_ADDRESS', 'Add new Address')}
                class={addressList?.addresses?.length > 0 ? 'secondary' : 'primary'}
                style={styles.button}
                onClick={() => onNavigationRedirect(
                  'AddressForm',
                  {
                    address: null,
                    onSaveAddress: handleSaveAddress,
                    addressesList: addressList?.addresses,
                    nopadding: true,
                    isSelectedAfterAdd: true,
                    hasAddressDefault: !!orderState.options?.address?.location,
                    isFromCheckout: route?.params?.isFromCheckout
                  })}
              />

              {addressList?.addresses?.length > 0 && (
                <OButton
                  text={t('CONTINUE', 'Continue')}
                  style={styles.button}
                  onClick={() => onNavigationRedirect(
                    'BottomTab', { screen: 'Home', isLogin })}
                />
              )}
            </>
          )}
        </>
      )}
    </Container >
  )
}

const styles = StyleSheet.create({
  address: {
    flex: 1,
    marginHorizontal: 5
  },
  button: { marginTop: 30 }
})

export { AddressListUI }

export const AddressList = (props: AddressListParams) => {
  const addressListProps = {
    ...props,
    UIComponent: AddressListUI
  }
  return <AddressListController {...addressListProps} />
}
