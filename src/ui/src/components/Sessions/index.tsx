import React, { useState } from 'react'
import { View } from 'react-native'
import { SessionsParams } from '../../types'
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import AntIcon from 'react-native-vector-icons/AntDesign'

import {
  SessionsWrapper,
  SessionItem,
  Container,
  DeleteSessionBtn
} from './styles'

import { useLanguage, useSession, useUtils, Sessions as SessionsController } from '@components'
import { NotFoundSource, OAlertOriginal as OAlert, OButton, OText } from '@ui'

export const SessionsUI = (props: SessionsParams) => {
  const {
    sessionsList,
    actionState,
    handleDeleteSession,
    handleDeleteAllSessions
  } = props

  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [{ parseDate }] = useUtils()
  const theme = useTheme()
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  const onDeleteSession = (session: any) => {
    setConfirm({
      open: true,
      title: t('WEB_APPNAME', 'Ordering'),
      content: [t('QUESTION_DELETE_SESSION', 'Are you sure to delete this session?')],
      handleOnAccept: () => {
        handleDeleteSession(session)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const onDeleteAllSessions = (isOldUser: any, deleteCurrent: any) => {
    setConfirm({
      open: true,
      title: t('WEB_APPNAME', 'Ordering'),
      content:
        isOldUser
          ? [t('QUESTION_ENABLE_ALL_SESSIONS', 'Are you sure to enable all sessions?')]
          : deleteCurrent
            ? [t('QUESTION_DELETE_ALL_SESSIONS', 'Are you sure that you want to delete all sessions?')]
            : [t('QUESTION_DELETE_ALL_SESSIONS_EXCEPT_CURRENT', 'Are you sure that you want to delete all sessions except current?')],
      handleOnAccept: () => {
        handleDeleteAllSessions(deleteCurrent)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  return (
    <Container showsVerticalScrollIndicator={false}>
      {user?.session_strategy === 'jwt_session' ? (
        <>
          {sessionsList.loading && (
            <SessionsWrapper>
              {[...Array(7).keys()].map(i => (
                <SessionItem key={i}>
                  <Placeholder Animation={Fade}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <PlaceholderLine width={40} />
                        <PlaceholderLine width={40} />
                      </View>
                      <PlaceholderLine width={10} />
                    </View>
                  </Placeholder>
                </SessionItem>
              ))}
            </SessionsWrapper>
          )}

          {!sessionsList.loading && sessionsList.sessions.length > 0 && (
            <SessionsWrapper>
              {sessionsList.sessions.map((session: any) => (
                <SessionItem key={session.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                      <OText color={theme.colors.backgroundGray300}>{parseDate(session.created_at)}</OText>
                      <OText>{parseDate(session.valid_thru)}</OText>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {session.current && (
                      <OText color={theme.colors.active} mRight={15}>{t('CURRENT', 'Current')}</OText>
                    )}
                    <DeleteSessionBtn
                      activeOpacity={1}
                      onPress={() => onDeleteSession(session)}
                    >
                      <AntIcon name='close' size={16} color={theme.colors.black} />
                    </DeleteSessionBtn>
                  </View>
                </SessionItem>
              ))}
              <OButton
                text={t('DELETE_ALL_SESSIONS_EXCEPT_CURRENT', 'Delete all sessions except current')}
                disabled={actionState.loading}
                textStyle={{ fontSize: 14 }}
                style={{ marginTop: 20 }}
                onClick={() => onDeleteAllSessions(false, false)}
              />
              <OButton
                text={t('DELETE_ALL_SESSIONS', 'Delete all sessions')}
                class='secondary'
                disabled={actionState.loading}
                textStyle={{ fontSize: 14 }}
                onClick={() => onDeleteAllSessions(false, true)}
              />
            </SessionsWrapper>
          )}

          {!sessionsList.loading && sessionsList.sessions.length === 0 && (
            <NotFoundSource
              srcImage={theme.images.general.notFound}
              content={t('NO_LOGIN_FOUND', 'No login found')}
            />
          )}
        </>
      ) : (
        <SessionsWrapper>
          <OText>
            {t('YOU_DONT_HAVE_ENABLED_THE_SESSIONS', 'You don\'t have enabled the sessions, please active them to have a better control of your sessions.')}
          </OText>
          <OButton
            text={t('ACTIVE_SESSIONS', 'Active sessions')}
            disabled={actionState.loading}
            textStyle={{ fontSize: 14 }}
            onClick={() => onDeleteAllSessions(true, false)}
            style={{ marginTop: 20 }}
          />
        </SessionsWrapper>
      )}
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </Container>
  )
}

export const Sessions = (props: SessionsParams) => {
  const sessionsProps = {
    ...props,
    UIComponent: SessionsUI,
    sortByDate: 'desc'
  }
  return <SessionsController {...sessionsProps} />
}
