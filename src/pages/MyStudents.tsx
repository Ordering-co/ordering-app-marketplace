import React from 'react';

import { useLanguage } from '@components';
import { StudentsList, NavBar, SafeAreaViewWrapper } from '@ui';

const MyStudents = ({ route, navigation }: any) => {
  const [, t] = useLanguage();

  const goToBack = () => navigation?.canGoBack() ? navigation.goBack() : navigation.navigate('BottomTab', { screen: 'Home' });

  return (
    <>
      <NavBar
        title={t('SCHOOL_MY_STUDENTS', 'My students')}
        onActionLeft={goToBack}
      />
      <SafeAreaViewWrapper>
        <StudentsList navigation={navigation} route={route} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default MyStudents;
