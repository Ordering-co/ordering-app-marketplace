import React from 'react'
import { MarkerAnimated, AnimatedRegion } from 'react-native-maps'
import FastImage from 'react-native-fast-image'

interface AnimatedDriverMarkerProps {
  coordinate: AnimatedRegion
  icon?: string | number
  title?: string
  zIndex?: number
  onImageLoad?: () => void
  tracksViewChanges?: boolean
}

export const AnimatedDriverMarker = ({
  coordinate, icon, title, zIndex = 99, onImageLoad, tracksViewChanges = false
}: AnimatedDriverMarkerProps) => {
  return (
    <MarkerAnimated
      zIndex={zIndex}
      coordinate={coordinate as any}
      title={title}
      tracksViewChanges={tracksViewChanges}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      {icon != null && (
        <FastImage
          source={typeof icon === 'number' ? icon : { uri: icon as string, priority: FastImage.priority.high }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
          onLoadEnd={onImageLoad}
        />
      )}
    </MarkerAnimated>
  )
}
