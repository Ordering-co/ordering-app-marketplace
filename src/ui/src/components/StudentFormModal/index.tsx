import React, { useState, useEffect } from 'react'
import { View, ScrollView, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'
import {
  useLanguage,
  useSchools,
  useSchoolStudents,
  useToast,
  ToastType,
  SCHOOL_ALLERGENS,
  SCHOOL_DIETARY_TAGS
} from '@components'
import { OModal, ODropDown, OInput, OButton, OText } from '../shared'
import { Form, Field, Label, ReadonlyField, ChipGroup, Chip, Actions } from './styles'

const generateCode = () => `STU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const buildInitialForm = (student: any, defaultSchoolId: any) => {
  if (student) {
    return {
      schoolId: student.school?.id ?? student.school_id ?? null,
      name: student.name || '',
      lastname: student.lastname || '',
      classroomId: student.classroom?.id ?? student.classroom_id ?? null,
      gradeId: student.grade?.id ?? student.grade_id ?? null,
      allergies: Array.isArray(student.allergies) ? student.allergies : [],
      dietaryTags: Array.isArray(student.dietary_tags) ? student.dietary_tags : []
    }
  }
  return { schoolId: defaultSchoolId ?? null, name: '', lastname: '', classroomId: null, gradeId: null, allergies: [], dietaryTags: [] }
}

export const StudentFormModal = (props: any) => {
  const { open, onClose, onSaved, defaultSchoolId, student } = props
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const theme: any = useTheme()
  const filterSchoolId = student ? (student.school?.id ?? student.school_id) : defaultSchoolId
  const { schools, loading: loadingSchools } = useSchools(filterSchoolId, open)
  const { createStudent, updateStudent } = useSchoolStudents()
  const [form, setForm] = useState(() => buildInitialForm(student, defaultSchoolId))
  const [saving, setSaving] = useState(false)

  const cardStyle: any = {
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }
      : { borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' })
  }

  const isEdit = !!student

  useEffect(() => {
    if (isEdit || form.schoolId) return
    if (schools.length === 1) setForm((f: any) => ({ ...f, schoolId: schools[0].id }))
  }, [isEdit, schools, form.schoolId])

  const selectedSchool = schools.find((s: any) => s.id === Number(form.schoolId))
  const schoolOptions = schools.map((s: any) => ({ value: s.id, content: s.name }))
  const classroomOptions = (selectedSchool?.classrooms || []).map((c: any) => ({ value: c.id, content: c.name }))
  const gradeOptions = [...(selectedSchool?.grades || [])]
    .sort((a: any, b: any) => a.id - b.id)
    .map((g: any) => ({ value: g.id, content: g.name }))
  const missingMessage = !form.schoolId
    ? t('SCHOOL_SELECT_SCHOOL', 'Select a school')
    : (!form.name || !form.lastname)
        ? t('SCHOOL_NAME_REQUIRED', 'Name is required')
        : !form.classroomId
            ? t('SCHOOL_CLASSROOM_REQUIRED', 'Classroom is required')
            : (gradeOptions.length > 0 && !form.gradeId)
                ? t('SCHOOL_GRADE_REQUIRED', 'Grade is required')
                : null

  const toggle = (key: 'allergies' | 'dietaryTags', value: string) => {
    setForm((f: any) => {
      const current = f[key] || []
      return { ...f, [key]: current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value] }
    })
  }

  const handleSave = async () => {
    if (!form.schoolId) { showToast(ToastType.Error, t('SCHOOL_SELECT_SCHOOL', 'Select a school')); return }
    if (!form.name || !form.lastname) { showToast(ToastType.Error, t('SCHOOL_NAME_REQUIRED', 'Name is required')); return }
    if (!form.classroomId) { showToast(ToastType.Error, t('SCHOOL_CLASSROOM_REQUIRED', 'Classroom is required')); return }
    if (gradeOptions.length > 0 && !form.gradeId) { showToast(ToastType.Error, t('SCHOOL_GRADE_REQUIRED', 'Grade is required')); return }
    setSaving(true)
    const payload: any = {
      classroom_id: form.classroomId,
      grade_id: form.gradeId || undefined,
      name: form.name,
      lastname: form.lastname,
      allergies: form.allergies,
      dietary_tags: form.dietaryTags
    }
    const { error, result } = isEdit
      ? await updateStudent(student.id, payload)
      : await createStudent({ ...payload, school_id: form.schoolId, code: generateCode() })
    setSaving(false)
    if (error) { showToast(ToastType.Error, Array.isArray(result) ? result[0] : result); return }
    showToast(ToastType.Success, t('SCHOOL_CHANGES_SAVED', 'Changes saved'))
    onSaved && onSaved(result)
    onClose && onClose()
  }

  return (
    <OModal
      open={open}
      onClose={onClose}
      isAvoidKeyBoardView
      title={isEdit ? t('SCHOOL_EDIT_STUDENT', 'Edit student') : t('SCHOOL_ADD_STUDENT', 'Add student')}
    >
      <GestureHandlerRootView>
        <ScrollView keyboardShouldPersistTaps='always' style={{ paddingHorizontal: 20 }}>
          <Form>
            <Field style={{ zIndex: 30 }}>
              <Label>{t('SCHOOL_SCHOOL', 'School')}</Label>
              {isEdit
                ? (
                  <ReadonlyField>
                    <OText size={15}>{selectedSchool?.name || student?.school?.name || '-'}</OText>
                  </ReadonlyField>
                  )
                : (
                  <ODropDown
                    secondary
                    key={`school-${form.schoolId ?? 'none'}`}
                    style={cardStyle}
                    bgcolor={'transparent'}
                    options={schoolOptions}
                    defaultValue={form.schoolId ? Number(form.schoolId) : null}
                    placeholder={t('SCHOOL_SELECT_SCHOOL', 'Select a school')}
                    onSelect={(value: any) => setForm((f: any) => ({ ...f, schoolId: value, classroomId: null, gradeId: null }))}
                    dropViewMaxHeight={250}
                    isModal
                    gestureScroll
                  />
                  )}
            </Field>

            <Field>
              <Label>{t('NAME', 'Name')}</Label>
              <OInput
                value={form.name}
                placeholder={t('NAME', 'Name')}
                onChange={(text: string) => setForm((f: any) => ({ ...f, name: text }))}
              />
            </Field>

            <Field>
              <Label>{t('LASTNAME', 'Lastname')}</Label>
              <OInput
                value={form.lastname}
                placeholder={t('LASTNAME', 'Lastname')}
                onChange={(text: string) => setForm((f: any) => ({ ...f, lastname: text }))}
              />
            </Field>

            <Field style={{ zIndex: 20 }}>
              <Label>{t('SCHOOL_CLASSROOM', 'Classroom')}</Label>
              <ODropDown
                secondary
                style={cardStyle}
                bgcolor={'transparent'}
                key={`classroom-${form.schoolId}`}
                options={classroomOptions}
                defaultValue={form.classroomId ? Number(form.classroomId) : null}
                placeholder={form.schoolId ? t('SCHOOL_SELECT_CLASSROOM', 'Select a classroom') : t('SCHOOL_SELECT_SCHOOL_FIRST', 'Select a school first')}
                onSelect={(value: any) => setForm((f: any) => ({ ...f, classroomId: value }))}
                dropViewMaxHeight={250}
                isModal
                gestureScroll
              />
            </Field>

            <Field style={{ zIndex: 10 }}>
              <Label>{t('SCHOOL_GRADE', 'Grade')}</Label>
              <ODropDown
                secondary
                style={cardStyle}
                bgcolor={'transparent'}
                key={`grade-${form.schoolId}`}
                options={gradeOptions}
                defaultValue={form.gradeId ? Number(form.gradeId) : null}
                placeholder={form.schoolId ? t('SCHOOL_SELECT_GRADE', 'Select a grade') : t('SCHOOL_SELECT_SCHOOL_FIRST', 'Select a school first')}
                onSelect={(value: any) => setForm((f: any) => ({ ...f, gradeId: value }))}
                dropViewMaxHeight={250}
                isModal
                gestureScroll
              />
            </Field>

            <Field>
              <Label>{t('SCHOOL_ALLERGIES', 'Allergies')}</Label>
              <ChipGroup>
                {SCHOOL_ALLERGENS.map((a: any) => {
                  const active = form.allergies.includes(a.value)
                  return (
                    <Chip
                      key={a.value}
                      onPress={() => toggle('allergies', a.value)}
                      style={{ borderColor: active ? theme.colors.primary : theme.colors.lightGray, backgroundColor: active ? theme.colors.primary : theme.colors.white }}
                    >
                      <OText size={13} color={active ? theme.colors.white : theme.colors.black}>
                        {t(`SCHOOL_ALLERGEN_${a.value.toUpperCase()}`, a.name)}
                      </OText>
                    </Chip>
                  )
                })}
              </ChipGroup>
            </Field>

            <Field>
              <Label>{t('SCHOOL_DIETARY_TAGS', 'Dietary tags')}</Label>
              <ChipGroup>
                {SCHOOL_DIETARY_TAGS.map((d: any) => {
                  const active = form.dietaryTags.includes(d.value)
                  return (
                    <Chip
                      key={d.value}
                      onPress={() => toggle('dietaryTags', d.value)}
                      style={{ borderColor: active ? theme.colors.primary : theme.colors.lightGray, backgroundColor: active ? theme.colors.primary : theme.colors.white }}
                    >
                      <OText size={13} color={active ? theme.colors.white : theme.colors.black}>
                        {t(`SCHOOL_DIETARY_${d.value.toUpperCase()}`, d.name)}
                      </OText>
                    </Chip>
                  )
                })}
              </ChipGroup>
            </Field>

            <Actions>
              <OButton
                text={saving ? t('LOADING', 'Loading') : (missingMessage || t('SAVE', 'Save'))}
                onClick={handleSave}
                disabled={saving || loadingSchools || !!missingMessage}
              />
            </Actions>
            <View style={{ height: 30 }} />
          </Form>
        </ScrollView>
      </GestureHandlerRootView>
    </OModal>
  )
}
