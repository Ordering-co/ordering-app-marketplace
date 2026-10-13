import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useSchoolStudents, useLanguage } from '@components'
import { OText } from '../shared'
import { StudentFormModal } from '../StudentFormModal'
import { Wrapper, Header, AddButton, StudentCard, Empty } from './styles'

export const StudentsList = (_props: any) => {
  const [, t] = useLanguage()
  const theme: any = useTheme()
  const { students, loading, refresh } = useSchoolStudents()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (student: any) => { setEditing(student); setFormOpen(true) }

  return (
    <Wrapper>
      <Header>
        <AddButton onPress={openCreate}>
          <OText size={14} color={theme.colors.white}>{t('SCHOOL_ADD_STUDENT', 'Add student')}</OText>
        </AddButton>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading
          ? (
            <Empty><OText size={14}>{t('LOADING', 'Loading')}</OText></Empty>
            )
          : students.length === 0
            ? (
              <Empty><OText size={14}>{t('SCHOOL_NO_STUDENTS_YET', 'You have no registered students yet. Add one to start ordering for them.')}</OText></Empty>
              )
            : students.map((student: any) => (
              <StudentCard key={student.id} onPress={() => openEdit(student)}>
                <OText size={16} weight='bold'>{student.name} {student.lastname}</OText>
                <OText size={13} color={theme.colors.backgroundGray300 || '#909BA9'}>
                  {[student.school?.name, student.classroom?.name, student.grade?.name].filter(Boolean).join(' · ') || '-'}
                </OText>
              </StudentCard>
            ))}
      </ScrollView>
      {formOpen && (
        <StudentFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          student={editing}
          onSaved={() => refresh()}
        />
      )}
    </Wrapper>
  )
}
