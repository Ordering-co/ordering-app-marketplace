const React = require('react')
const { View, TouchableOpacity } = require('react-native')

function SwiperFlatList (props) {
  const { data = [], renderItem } = props
  return React.createElement(
    View,
    { testID: 'swiper-flatlist' },
    data.map((item, index) =>
      React.createElement(
        TouchableOpacity,
        {
          key: `swiper-${index}`,
          testID: `swiper-item-${index}`,
          onPress: () => renderItem?.({ item, index })
        },
        renderItem?.({ item, index })
      )
    )
  )
}

module.exports = {
  __esModule: true,
  default: SwiperFlatList,
  SwiperFlatList
}
