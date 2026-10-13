import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import AntDesignIcons from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import { SingleProductReviewParams } from '../../types'
import { reviewCommentList } from '../../utils'

import {
  ProductContainer,
  ProductHeader,
  LikeHandsActionContainer,
  LikeHandsButton,
  CommentsButtonGroup,
  LogoWrapper,
  LogoContainer,
} from './styles'

import { useLanguage, useUtils } from '@components'
import { OText, OButton, OInput, OIcon } from '../shared'

export const SingleProductReview = (props: SingleProductReviewParams) => {
  const {
    product,
    formState,
    handleChangeFormState,
    order
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ optimizeImage }] = useUtils()
  const styles = StyleSheet.create({
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    },
    additionalCommentButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
    },
    productStyle: {
      width: 44,
      height: 44,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    reviewedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20
    },
  })

  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [qualification, setQualification] = useState(5)
  const [currentValue, setCurrentValue] = useState(5)

  const commentsList = reviewCommentList('product')

  const isSelectedComment = (commentKey: number) => {
    const found = comments.find((comment: any) => comment?.key === commentKey)
    return found
  }

  const handleChangeQualification = (index: number) => {
    if (qualification === index) return
    setQualification(index)
    setComments([])
  }

  const handleChangeComment = (commentItem: any) => {
    const found = comments.find((comment: any) => comment?.key === commentItem.key)
    if (found) {
      const _comments = comments.filter((comment: any) => comment?.key !== commentItem.key)
      setComments(_comments)
    } else {
      setComments([...comments, commentItem])
    }
  }

  useEffect(() => {
    const value = qualification ? 5 : 1
    setCurrentValue(value)
    if (value !== currentValue) setComments([])
    if (comments?.length === 0 && !extraComment && formState.changes?.length === 0 && qualification === 5) return
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    let found = false
    const _changes = formState.changes.map((item: any) => {
      if (item?.product_id === product?.product_id) {
        found = true
        return {
          product_id: product?.product_id,
          comment: _comment,
          qualification: qualification
        }
      }
      return item
    })
    if (!found) {
      _changes.push({
        product_id: product?.product_id,
        comment: _comment,
        qualification: qualification
      })
    }
    handleChangeFormState && handleChangeFormState(_changes)
  }, [comments, extraComment, qualification])

  return (
    <>
      <ProductContainer>
        <LogoWrapper>
          <View style={{ maxWidth: '75%', flex: 1 }}>
            <OText
              size={20}
              weight="700"
            >
              {t('REVIEW_PRODUCT', 'Review Product')}
            </OText>
            <OText size={14}>{t('HOW_WAS_YOUR_EXPERIENCE_WITH', 'How was your experience with')} {product?.name}?</OText>
          </View>
          <LogoContainer>
            {product?.images ? (
              <FastImage
                style={styles.productStyle}
                source={{
                  uri: optimizeImage(product?.images, 'h_250,c_limit'),
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <OIcon
                src={theme?.images?.dummies?.product}
                width={44}
                height={44}
              />
            )}
          </LogoContainer>
        </LogoWrapper>
        {order?.review || (formState?.result?.result && !formState?.result?.error) ? (
          <View style={styles.reviewedStyle}>
            <OText color={theme.colors.primary}>{t('ORDER_REVIEWED', 'This order has been already reviewed')}</OText>
          </View>
        ) : (
          <>
            <ProductHeader>
              <LikeHandsActionContainer>
                <LikeHandsButton
                  isLike
                  onPress={() => handleChangeQualification(5)}
                >
                  <AntDesignIcons name='like2' size={33} color={qualification === 5 ? theme.colors.primary : theme.colors.lightGray} />
                </LikeHandsButton>
                <LikeHandsButton onPress={() => handleChangeQualification(1)}>
                  <AntDesignIcons name='dislike2' size={33} color={qualification === 1 ? theme.colors.primary : theme.colors.lightGray} />
                </LikeHandsButton>
              </LikeHandsActionContainer>
            </ProductHeader>
            <View style={{ borderWidth: 0.5, borderColor: theme.colors.backgroundGray200, marginTop: 20 }} />
            <OText
              style={{ marginTop: 30 }}
              weight="700"
            >
              {commentsList[qualification === 5 ? 'like' : 'dislike']?.title}
            </OText>
            <CommentsButtonGroup>
              {commentsList[qualification === 5 ? 'like' : 'dislike']?.map((commentItem: any) => (
                <OButton
                  key={commentItem.key}
                  text={commentItem.content}
                  textStyle={{
                    color: isSelectedComment(commentItem.key) ? theme.colors.active : theme.colors.primary,
                    fontSize: 12,
                  }}
                  style={{
                    height: 40,
                    paddingLeft: 5,
                    paddingRight: 5,
                    marginHorizontal: 3,
                    marginVertical: 10,
                    borderRadius: 15,
                    backgroundColor: isSelectedComment(commentItem.key) ? theme.colors.activeContrast : theme.colors.white,
                    borderColor: isSelectedComment(commentItem.key) ? theme.colors.active : theme.colors.alert
                  }}
                  onClick={() => handleChangeComment(commentItem)}
                />
              ))}
            </CommentsButtonGroup>
            <View style={{ borderWidth: 0.5, borderColor: theme.colors.backgroundGray200, marginTop: 20 }} />
            <View>
              <OText
                size={16}
                weight="700"
                style={{ marginTop: 30 }}
              >
                {t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}
              </OText>
              <OInput
                name='comments'
                placeholder={t('COMMENTS', 'Comments')}
                onChange={(val: any) => setExtraComment(val.target.value)}
                placeholderTextColor={theme.colors.secondaryContrast}
                borderColor={theme.colors.secondaryContrast}
                style={styles.inputTextArea}
                multiline
              />
            </View>
          </>
        )}
      </ProductContainer>
    </>
  )
}
