import React from 'react';
import {
  StyleSheet,
  Platform,
  DeviceEventEmitter
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { _retrieveStoreData, _setStoreData, ProjectForm as ProjectFormController } from '@ui';

export const ProjectForm = (props: any) => {
  const projectFormProps = {
    ...props,
    navigation: props.navigation,
    EventEmitter: DeviceEventEmitter,
    setStoreData: _setStoreData,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page, params);
    },
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ProjectFormController {...projectFormProps} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 30
  },
});

export default ProjectForm;
