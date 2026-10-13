import { Dimensions } from 'react-native';

export const useUtilsHome = () => {
  const { height: screenHeight } = Dimensions.get('window');

  const getResponsiveSizes = (titleLength = 0) => {
    let fontSize = 56
    let titleMarginTop = 80

    if (screenHeight < 680) {
      fontSize = 32
      titleMarginTop = 40
    } else if (screenHeight < 800) {
      fontSize = 48
      titleMarginTop = 60
    }

    // Longer locales (es, fr, tr, …) need a smaller display size so words are not mid-cut.
    if (titleLength > 44) {
      fontSize = Math.round(fontSize * 0.62)
    } else if (titleLength > 34) {
      fontSize = Math.round(fontSize * 0.78)
    } else if (titleLength > 28) {
      fontSize = Math.round(fontSize * 0.9)
    }

    return {
      fontSize: Math.max(28, fontSize),
      titleMarginTop,
      lineHeight: Math.round(Math.max(28, fontSize) * 1.2),
    };
  };

  return {
    getResponsiveSizes
  }
};
