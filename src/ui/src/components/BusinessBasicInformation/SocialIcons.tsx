import React from 'react'
import { Linking, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

import { SocialIcon, SocialListWrapper } from './styles'

const SocialNetWork = (props: any) => {
  const { socialLink, iconTitle, noMaterialIcon } = props
  const theme = useTheme()

  return (
    <SocialIcon activeOpacity={1} onPress={() => Linking.openURL(socialLink)}>
      {noMaterialIcon ? (
        <Ionicons
          name={`logo-${iconTitle}`}
          color={theme.colors.black}
          size={22}
        />
      ) : (
        <MaterialComIcon
          name={iconTitle}
          color={theme.colors.black}
          size={22}
        />
      )}
    </SocialIcon>
  )
}

export const SocialIcons = (props: any) => {
  const { loading, business } = props

  const socialProfiles = [
    { profile: business?.facebook_profile, iconTitle: 'facebook' },
    { profile: business?.instagram_profile, iconTitle: 'instagram' },
    { profile: business?.tiktok_profile, iconTitle: 'tiktok', noMaterialIcon: true },
    { profile: business?.pinterest_profile, iconTitle: 'pinterest' },
    { profile: business?.whatsapp_number, iconTitle: 'whatsapp' },
    { profile: business?.snapchat_profile, iconTitle: 'snapchat' }
  ];

  return (
    <>
      {!loading && (
        <SocialListWrapper
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}
        >
          {socialProfiles.filter(({ profile }) => profile).map(({ profile, iconTitle, noMaterialIcon }) => (
            <SocialNetWork
              key={iconTitle}
              socialLink={profile}
              iconTitle={iconTitle}
              noMaterialIcon={noMaterialIcon}
            />
          ))}
        </SocialListWrapper>
      )}

      {loading && (
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
            {[...Array(5).keys()].map(i => (
              <SocialIcon activeOpacity={1} onPress={() => { }} style={{ borderWidth: 0 }} key={i}>
                <PlaceholderLine width={100} height={20} style={{ marginBottom: 0 }} />
              </SocialIcon>
            ))}
          </View>
        </Placeholder>
      )}
    </>
  )
}
