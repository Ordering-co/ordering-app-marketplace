import React, { useState, useMemo } from 'react'
import { useTheme } from 'styled-components/native'
import { useSchoolStudents, useLanguage, useOrder, useSelectedStudent } from '@components'
import { OModal, OButton, OText } from '../shared'
import { Content, Intro, ItemList, Item, Actions } from './styles'

const toArray = (value: any) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      return []
    }
  }
  return []
}

const conflictReasons = (product: any, student: any) => {
  const reasons: any = { allergens: [], missingDietary: [] }
  const studentAllergies = toArray(student?.allergies)
  const studentDietary = toArray(student?.dietary_tags)
  const productAllergens = toArray(product?.allergens)
  reasons.allergens = productAllergens.filter((a: any) => studentAllergies.includes(a))
  if (product?.dietary_tags !== undefined && product?.dietary_tags !== null) {
    const productDietary = toArray(product.dietary_tags)
    reasons.missingDietary = studentDietary.filter((d: any) => !productDietary.includes(d))
  }
  return reasons
}

const hasConflict = (reasons: any) => reasons.allergens.length > 0 || reasons.missingDietary.length > 0

export const CartStudentAlert = (props: any) => {
  const { cart } = props
  const [, t] = useLanguage()
  const theme: any = useTheme()
  const { students } = useSchoolStudents()
  const [, { removeProduct }]: any = useOrder()
  const { studentId: selectedStudentId } = useSelectedStudent(cart?.business?.slug)
  const [dismissedSig, setDismissedSig] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)

  const studentId = cart?.student_id ?? cart?.student?.id ?? selectedStudentId
  const student = cart?.student || students.find((s: any) => s.id === Number(studentId))

  const conflicting = useMemo(() => {
    if (!student) return []
    return (cart?.products || [])
      .map((product: any) => ({ product, reasons: conflictReasons(product, student) }))
      .filter((entry: any) => hasConflict(entry.reasons))
  }, [cart?.products, student])

  const signature = conflicting.map((e: any) => e.product.code ?? e.product.id).sort().join(',')
  const open = conflicting.length > 0 && signature !== dismissedSig

  const handleKeep = () => setDismissedSig(signature)

  const handleRemove = async () => {
    setRemoving(true)
    for (const entry of conflicting) {
      try { await removeProduct(entry.product, cart) } catch (err) {}
    }
    setRemoving(false)
    setDismissedSig(signature)
  }

  const reasonText = (reasons: any) => {
    const parts = []
    if (reasons.allergens.length) parts.push(`${t('SCHOOL_ALLERGIES', 'Allergies')}: ${reasons.allergens.join(', ')}`)
    if (reasons.missingDietary.length) parts.push(`${t('SCHOOL_MISSING_DIETARY', 'Missing dietary')}: ${reasons.missingDietary.join(', ')}`)
    return parts.join(' · ')
  }

  return (
    <OModal
      open={open}
      onClose={handleKeep}
      title={t('SCHOOL_CART_CONFLICT_TITLE', 'Items not suitable for student')}
    >
      <Content>
        <Intro>
          <OText size={14}>
            {t('SCHOOL_CART_CONFLICT_INTRO', 'These items in your cart do not match')} {student?.name} {student?.lastname}{t('SCHOOL_CART_CONFLICT_INTRO_2', "'s allergies or dietary needs:")}
          </OText>
        </Intro>
        <ItemList>
          {conflicting.map((entry: any) => (
            <Item key={entry.product.code ?? entry.product.id}>
              <OText size={15} weight='bold'>{entry.product.name}</OText>
              <OText size={13} color={theme.colors.backgroundGray300 || '#909BA9'}>{reasonText(entry.reasons)}</OText>
            </Item>
          ))}
        </ItemList>
        <Actions>
          <OButton
            text={removing ? t('LOADING', 'Loading') : t('SCHOOL_REMOVE_ITEMS', 'Remove these items')}
            onClick={handleRemove}
            disabled={removing}
            parentStyle={{ marginBottom: 10 }}
          />
          <OButton
            text={t('SCHOOL_KEEP_ITEMS', 'Keep them')}
            onClick={handleKeep}
            disabled={removing}
            class='secondary'
          />
        </Actions>
      </Content>
    </OModal>
  )
}
