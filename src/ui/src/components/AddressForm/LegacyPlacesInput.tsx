import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  consumeLegacyFallback,
  createSessionToken,
  fetchLegacyDetails,
  fetchLegacyPredictions,
} from './googlePlaces';

interface LegacyPlacesInputProps {
  apiKey: string;
  value?: string;
  placeHolderText?: string;
  includedRegionCodes?: string[];
  debounceDelay?: number;
  style?: any;
  onPlaceSelect: (details: any) => void;
  onTextChange?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onError?: (error: any) => void;
}

export const LegacyPlacesInput = forwardRef((props: LegacyPlacesInputProps, ref) => {
  const {
    apiKey,
    value,
    placeHolderText,
    includedRegionCodes,
    debounceDelay = 200,
    style = {},
    onPlaceSelect,
    onTextChange,
    onFocus,
    onBlur,
    onError,
  } = props;

  const inputRef = useRef<TextInput>(null);
  const debounceTimeout = useRef<any>(null);
  const requestId = useRef(0);
  const sessionToken = useRef(createSessionToken());
  const [inputText, setInputText] = useState(value || '');
  const [predictions, setPredictions] = useState<any[]>([]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      clearTimeout(debounceTimeout.current);
      setInputText('');
      setPredictions([]);
    },
    blur: () => inputRef.current?.blur(),
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    setInputText(value ?? '');
  }, [value]);

  useEffect(() => {
    const shouldFetch = consumeLegacyFallback();
    if (shouldFetch && value) {
      inputRef.current?.focus();
      requestPredictions(value);
    }
    return () => clearTimeout(debounceTimeout.current);
  }, []);

  const requestPredictions = async (text: string) => {
    const currentRequest = ++requestId.current;
    if (!text) {
      setPredictions([]);
      return;
    }
    try {
      const result = await fetchLegacyPredictions({
        text,
        apiKey,
        regionCodes: includedRegionCodes,
        sessionToken: sessionToken.current,
      });
      if (currentRequest === requestId.current) setPredictions(result);
    } catch (error) {
      if (currentRequest === requestId.current) setPredictions([]);
      onError?.(error);
    }
  };

  const handleTextChange = (text: string) => {
    setInputText(text);
    onTextChange?.(text);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => requestPredictions(text), debounceDelay);
  };

  const handleSelect = async (prediction: any) => {
    clearTimeout(debounceTimeout.current);
    requestId.current += 1;
    setInputText(prediction.mainText);
    setPredictions([]);
    Keyboard.dismiss();
    try {
      const details = await fetchLegacyDetails({
        placeId: prediction.placeId,
        apiKey,
        sessionToken: sessionToken.current,
      });
      onPlaceSelect(details);
    } catch (error) {
      onError?.(error);
    }
    sessionToken.current = createSessionToken();
  };

  const suggestionsContainerStyle = StyleSheet.flatten(style.suggestionsContainer);
  const suggestionBackground = suggestionsContainerStyle?.backgroundColor || '#efeff1';

  const renderSuggestion = ({ item }: { item: any }) => {
    const handlePress = () => handleSelect(item);
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.description}
        style={[styles.suggestionItem, { backgroundColor: suggestionBackground }, style.suggestionItem]}
        onPress={handlePress}
      >
        <Text style={[styles.mainText, style.suggestionText?.main]}>{item.mainText}</Text>
        {!!item.secondaryText && (
          <Text style={[styles.secondaryText, style.suggestionText?.secondary]}>{item.secondaryText}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style.container]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, style.input]}
        value={inputText}
        placeholder={placeHolderText}
        placeholderTextColor={style.placeholder?.color}
        onChangeText={handleTextChange}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCorrect={false}
        clearButtonMode="never"
        accessibilityRole="search"
        accessibilityLabel={placeHolderText}
      />
      {predictions.length > 0 && (
        <View style={[styles.suggestionsContainer, style.suggestionsContainer]}>
          <FlatList
            data={predictions}
            renderItem={renderSuggestion}
            keyExtractor={item => item.placeId}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            bounces={false}
            style={style.suggestionsList}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  input: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    fontSize: 16,
  },
  suggestionsContainer: {
    backgroundColor: '#efeff1',
    borderRadius: 6,
    marginTop: 3,
    overflow: 'hidden',
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
  },
  mainText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#000000',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'left',
  },
});
