import React from 'react'
import { useTheme } from 'styled-components/native';
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import Icon2 from 'react-native-vector-icons/Ionicons';

import { OText } from '@ui'
import { useLanguage } from '@components'

const TAG_OPTIONS = [
  { key: 'home', icon: 'home-outline' },
  { key: 'office', icon: 'briefcase-outline' },
  { key: 'favorite', icon: 'star-outline' },
  { key: 'other', icon: 'ellipsis-horizontal-outline' }
];

/**
 * TagOptions component for React Native
 *
 * @param {Object} props
 * @param {Array} props.tags - Array of tag objects { id, name, selected }
 * @param {Function} props.onSelect - Callback when a tag is selected, receives tag id
 */
export const TagOptions = ({ selectedTag, setSelectedTag }: any) => {
  const theme = useTheme();
  const [, t] = useLanguage()

  return (
    <View style={styles.tagContainer}>
      {TAG_OPTIONS.map(tag => (
        <TouchableOpacity
          key={tag.key}
          style={[
            styles.tagCard,
            selectedTag === tag.key && { backgroundColor: theme.colors.activeContrast },
            { borderColor: selectedTag === tag.key ? theme.colors.active : theme.colors.border }
          ]}
          activeOpacity={0.8}
          onPress={() => setSelectedTag(selectedTag === tag.key ? null : tag.key)}
        >
          <Icon2
            name={tag.icon}
            size={18}
            color={selectedTag === tag.key ? theme.colors.active : theme.colors.black}
            style={{ marginBottom: 2 }}
          />
          <OText
            size={12}
            weight={600}
            style={{
              color: selectedTag === tag.key ? theme.colors.active : theme.colors.black,
              textTransform: 'capitalize'
            }}
          >
            {t(`ADDRESS_TAG_${tag.key.toUpperCase()}`, tag.key)}
          </OText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 5,
    marginBottom: 10,
    gap: 10
  },
  tagCard: {
    minWidth: 70,
    maxWidth: 90,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderWidth: 1
  }
})
