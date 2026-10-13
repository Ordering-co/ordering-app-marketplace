import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useTheme } from 'styled-components/native';
import { WebView } from 'react-native-webview';

import { BusinessInformationParams } from '../../types';
import { formatUrlVideo } from '../../utils'
import { ScheduleTable } from './ScheduleTable';

import {
  BusinessInformationContainer,
  WrapMainContent,
  GrayBackground,
  WrapScheduleBlock,
  ScheduleBlock,
  WrapBusinessMap,
  InnerContent,
  DivideView,
  MediaWrapper,
} from './styles';

import { BusinessInformation as BusinessInformationController, useLanguage, useUtils, useConfig } from '@components';
import { DeviceOrientationMethods, ScheduleAccordion, GoogleMap, OIcon, OText } from '@ui'

const { useDeviceOrientation } = DeviceOrientationMethods

const BUSINESS_LOCATION_ZOOM_DELTA = 0.00042
const BUSINESS_LOCATION_ZONE_FIT_PADDING = 0
const BUSINESS_LOCATION_MAX_ZONE_ZOOM = 20

const BusinessInformationUI = (props: BusinessInformationParams) => {
  const { businessState, businessSchedule, businessLocation } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ optimizeImage, timeFormat }] = useUtils();
  const [{ configs }] = useConfig()
  const [orientationState] = useDeviceOrientation();

  const [isReadMore, setIsReadMore] = useState(false)
  const [lengthMore, setLengthMore] = useState(false)
  const WIDTH_SCREEN = orientationState?.dimensions?.width
  const useAlternativeMap = configs?.use_alternative_to_google_maps?.value === '1'

  const hideLocation = theme?.business_view?.components?.information?.components?.location?.hidden
  const hideSchedule = theme?.business_view?.components?.information?.components?.schedule?.hidden
  const hideVideos = theme?.business_view?.components?.information?.components?.videos?.hidden
  const hideImages = theme?.business_view?.components?.information?.components?.images?.hidden
  const hideAddress = theme?.business_view?.components?.information?.components?.address?.hidden
  const formatTime = timeFormat

  const checkTime = (val: number) => (val < 10 ? `0${val}` : val);
  const timeFormated = (time: any) => {
    return moment(`1900-01-01 ${checkTime(time.hour)}:${checkTime(time.minute)}`).format(formatTime)
  }

  const businessCoordinate = {
    lat: businessState?.business?.location?.lat,
    lng: businessState?.business?.location?.lng,
  };
  const businessImage = {
    uri: businessState?.business?.logo,
  };
  const businessMarker = {
    latlng: businessCoordinate,
    image: businessImage,
  };

  const bVideos = () => {
    const len = businessState?.business?.gallery?.length | 0;
    if (len == 0) return [];
    const vAry = businessState?.business?.gallery.filter(
      ({ type, file }: any) => type == 2 && file == null,
    );
    return vAry;
  };
  //{uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1'}
  const bImages: any = () => {
    const len = businessState?.business?.gallery?.length | 0;
    if (len == 0) return [];
    const iAry = businessState?.business?.gallery.filter(
      ({ type, video }: any) => type == 1 && video == null,
    );
    return iAry;
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore((e.nativeEvent.lines.length == 3 && e.nativeEvent.lines[2].width > WIDTH_SCREEN * .76) || e.nativeEvent.lines.length > 3)
  }, [])

  return (
    <BusinessInformationContainer>
      <WrapMainContent showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <InnerContent>
          {!hideLocation && (
            <>
              {!hideAddress && (
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                  <OIcon
                    src={theme.images.general.pin}
                    color={theme.colors.active}
                    width={18}
                    style={{ marginRight: 10 }}
                  />
                  <OText>
                    {businessState?.business?.address}
                  </OText>
                </View>
              )}
              {!useAlternativeMap && businessLocation.location && (
                <WrapBusinessMap>
                  <GoogleMap
                    readOnly
                    location={businessLocation.location}
                    delta={BUSINESS_LOCATION_ZOOM_DELTA}
                    zoneFitPadding={BUSINESS_LOCATION_ZONE_FIT_PADDING}
                    maxZoomAfterZoneFit={BUSINESS_LOCATION_MAX_ZONE_ZOOM}
                    markerTitle={businessState?.business?.name}
                    businessZones={businessState?.business?.zones}
                  />
                </WrapBusinessMap>
              )}
            </>
          )}
          {businessState?.business?.address_notes && (
            <>
              <OText
                size={12}
                mBottom={10}
                numberOfLines={isReadMore ? 20 : 3}
                onTextLayout={onTextLayout}
              >
                {businessState?.business?.address_notes}
              </OText>
              {lengthMore && (
                <TouchableOpacity
                  onPress={() => setIsReadMore(!isReadMore)}
                >
                  <OText size={12} mBottom={20} color={theme.colors.primary}>{isReadMore ? t('SHOW_LESS', 'Show less') : t('READ_MORE', 'Read more')}</OText>
                </TouchableOpacity>
              )}
            </>
          )}

          <DivideView />

          {!hideSchedule && businessSchedule && businessSchedule?.length > 0 && (
            <ScheduleTable schedule={businessSchedule} />
          )}

          {!hideImages && bImages().length > 0 && (
            <>
              <DivideView />
              <OText size={16} weight='bold'>{t('PHOTOS', 'Photos')}</OText>
              <MediaWrapper horizontal contentContainerStyle={{ gap: 20 }}>
                {bImages().map((i: any) => (
                  i.file != null &&
                  <View key={i.id} style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <OIcon cover url={optimizeImage(i?.file, 'h_150,c_limit')} width={210} height={127} />
                  </View>
                ))}
              </MediaWrapper>
            </>
          )}

          {!hideVideos && bVideos().length > 0 && (
            <>
              <DivideView />
              <OText size={16} weight="bold">{t('VIDEOS', 'Videos')}</OText>
              <MediaWrapper horizontal>
                {bVideos().map((v: any) => (
                  <WebView
                    key={`vid_id_${v.id}`}
                    style={{ width: 210, height: 127, borderRadius: 20 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{
                      html: `
                  <iframe width='80%' height='80%' src="${formatUrlVideo(v.video)}" frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
                  `,
                    }}
                    mediaPlaybackRequiresUserAction={true}
                  />
                ))}
              </MediaWrapper>
            </>
          )}
        </InnerContent>
      </WrapMainContent>
    </BusinessInformationContainer>
  );
};

export const BusinessInformation = (props: BusinessInformationParams) => {
  const BusinessInformationProps = {
    ...props,
    UIComponent: BusinessInformationUI,
  };
  return <BusinessInformationController {...BusinessInformationProps} />;
};
