import React from 'react'
import { Callout, Marker } from 'react-native-maps'
import { BusinessCallout } from './BusinessCallout'
import { MarkerPin, MarkerBubble, MarkerLogo, MarkerPointer } from './styles'

interface RenderMarkerProps {
  marker: { lat: number, lng: number, title: string, icon: string }
  i: number
  markerImageLoaded: number
  visibleMarkersLength: number
  selected?: boolean
  getMarkerSource: (icon: string | number) => any
  handleMarkerImageLoad: () => void
  handleMarkerPress: (marker: any) => void
  handleMarkerSelect?: (marker: any) => void
}

export const RenderMarker = React.memo(({
  marker,
  i,
  markerImageLoaded,
  visibleMarkersLength,
  selected,
  getMarkerSource,
  handleMarkerImageLoad,
  handleMarkerPress,
  handleMarkerSelect
}: RenderMarkerProps) => {
  return (
    <Marker
      zIndex={selected ? visibleMarkersLength + 1 : i}
      coordinate={{ latitude: marker.lat ?? 0, longitude: marker.lng ?? 0 }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={selected || !(markerImageLoaded === visibleMarkersLength)}
      onPress={() => handleMarkerSelect?.(marker)}
    >
      <MarkerPin>
        <MarkerBubble selected={selected}>
          <MarkerLogo
            source={getMarkerSource(marker?.icon)}
            onLoadEnd={handleMarkerImageLoad}
          />
        </MarkerBubble>
        <MarkerPointer selected={selected} />
      </MarkerPin>
      <Callout
        tooltip
        onPress={() => handleMarkerPress(marker)}
      >
        <BusinessCallout
          business={marker}
          onPressButton={() => handleMarkerPress(marker)}
        />
      </Callout>
    </Marker>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.markerImageLoaded === nextProps.markerImageLoaded &&
    prevProps.visibleMarkersLength === nextProps.visibleMarkersLength &&
    prevProps.selected === nextProps.selected &&
    prevProps.marker.lat === nextProps.marker.lat &&
    prevProps.marker.lng === nextProps.marker.lng &&
    prevProps.marker.icon === nextProps.marker.icon &&
    prevProps.marker.title === nextProps.marker.title &&
    prevProps.i === nextProps.i
  )
})
