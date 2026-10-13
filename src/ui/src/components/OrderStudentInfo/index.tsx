import React from 'react'
import { useTheme } from 'styled-components/native'
import { useSchoolStudents, useLanguage } from '@components'
import { OText } from '../shared'
import { Container, Inner } from './styles'

export const OrderStudentInfo = (props: any) => {
  const { order } = props
  const [, t] = useLanguage()
  const theme: any = useTheme()
  const { students } = useSchoolStudents()

  const studentId = order?.student?.id ?? order?.student_id
  if (!studentId) return null
  const student = order?.student || students.find((s: any) => s.id === Number(studentId))
  if (!student) return null

  const meta = [student.classroom?.name, student.grade?.name].filter(Boolean).join(' · ')

  return (
    <Container>
      <Inner>
        <OText size={18} weight='bold'>{t('SCHOOL_STUDENT', 'Student')}</OText>
        <OText size={15}>{student.name} {student.lastname}</OText>
        {!!meta && <OText size={13} color={theme.colors.backgroundGray300 || '#909BA9'}>{meta}</OText>}
      </Inner>
    </Container>
  )
}
