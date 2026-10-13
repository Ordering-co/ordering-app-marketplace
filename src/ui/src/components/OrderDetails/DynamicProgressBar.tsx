import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OText } from '@ui'

import ProgressBar, { DynamicProgressBarContainer } from './styles'
import { useLanguage } from '@components'

type DynamicProgressBarProps = {
  status: number
}

const statuses = {
  ORDER_PLACED: { values: [0, 13], weight: 1.4 },
  PREP: { values: [7], weight: 1.3 },
  BAKE: { values: [4, 14], weight: 1.4 },
  QUALITY_CHECK: { values: [3, 8, 9, 18, 20, 21, 22, 24, 25], weight: 1.5 },
  DELIVERY: { values: [1, 11, 15, 19, 23, 26], weight: 2.8 }
}

const calculateProgress = (status: number) => {
  const groupIndex = Object.keys(statuses).findIndex((key) =>
    statuses[key as keyof typeof statuses].values.includes(status)
  )
  return groupIndex
}

export const DynamicProgressBar = (props: DynamicProgressBarProps) => {
  const { status } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const totalWeight = Object.values(statuses).reduce((acc: number, currGroup: any) => acc + currGroup.weight, 0)
  const groupIndex = Object.keys(statuses).findIndex((key) =>
    statuses[key as keyof typeof statuses].values.includes(status)
  )

  return (
    <>
      <DynamicProgressBarContainer>
        <View style={styles.progressLabels}>
          {Object.keys(statuses).map((label, index) => {
            return (
              <OText
                key={index}
                size={8}
              >
                {t(label, label.replace(/_/g, ' '))?.toUpperCase()}
              </OText>
            )
          })}
        </View>
        <View style={styles.progressBar}>
          {Object.keys(statuses).map((label, index) => {
            const sectionWeight = statuses[label as keyof typeof statuses].weight
            const sectionWidth = (sectionWeight / totalWeight) * 100
            const isFilled = index <= groupIndex

            return (
              <View
                key={index}
                style={[
                  styles.progressSection,
                  {
                    width: `${sectionWidth + 3}%`,
                    backgroundColor: isFilled ? theme.colors.green500 : theme.colors.backgroundGray
                  }
                ]}
              />
            )
          })}
        </View>
      </DynamicProgressBarContainer>
      <ProgressBar progress={calculateProgress(status)} />
    </>
  )
}

const styles = StyleSheet.create({
  progressLabels: {
    position: 'relative',
    height: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 0
  },
  progressSection: {
    height: '100%',
    marginRight: 4,
    borderRadius: 1
  }
})
