import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { ListWrapper } from './styles'

export const FlatListBusinessListFooter = (props: any) => {
  const {
    businessesList,
    paginationProps
  } = props
  const theme = useTheme()

  return (
    <>
      <ListWrapper style={{
        paddingHorizontal: 20,
        marginTop: 20,
        ...(props.homeLayout === 'maweja' ? { backgroundColor: theme.colors.backgroundPage } : {})
      }}>
        {(businessesList.loading || !businessesList?.fetched) && (
          <>
            {[...Array(paginationProps.nextPageItems ? paginationProps.nextPageItems : 8).keys()].map((_, i) => (
              <Placeholder Animation={Fade} key={i} style={{ marginBottom: 20 }}>
                <View style={{ width: '100%' }}>
                  <PlaceholderLine height={180} style={{ marginBottom: 20, borderRadius: 25 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <PlaceholderLine height={70} width={100} style={{ marginBottom: 10 }} />
                    </View>
                    <View style={{ width: '80%', marginLeft: 20 }}>
                      <PlaceholderLine height={15} width={60} style={{ marginBottom: 10 }} />
                      <PlaceholderLine height={15} width={40} style={{ marginBottom: 10 }} />
                      <PlaceholderLine height={15} width={80} style={{ marginBottom: 10 }} />
                    </View>
                  </View>
                </View>
              </Placeholder>
            ))}
          </>
        )}
      </ListWrapper>
    </>
  )
}
