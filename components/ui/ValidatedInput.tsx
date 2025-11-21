import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
};

interface Props extends TextInputProps {
  label: string;
  validationRules?: ValidationRule[];
  onValidationChange?: (isValid: boolean) => void;
  containerStyle?: ViewStyle;
  value?: string;
  onChangeText?: (text: string) => void;
  forceShowError?: boolean;
}

export default function ValidatedInput({
  label,
  validationRules = [],
  onValidationChange,
  containerStyle,
  style,
  value: externalValue,
  onChangeText: externalOnChangeText,
  forceShowError = false,
  ...props
}: Props) {
  const [internalValue, setInternalValue] = useState('');
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnimation = useMemo(() => new Animated.Value(0), []);

  // Usar valor externo si se proporciona, sino usar interno
  const value = externalValue !== undefined ? externalValue : internalValue;
  
  // Detectar si es un campo de contraseña
  const isPasswordField = props.secureTextEntry === true;

  const validate = useCallback((text: string) => {
    if (validationRules.length === 0) return true;

    for (const rule of validationRules) {
      if (!rule.test(text)) {
        setError(rule.message);
        onValidationChange?.(false);
        return false;
      }
    }

    setError('');
    onValidationChange?.(true);
    return true;
  }, [validationRules, onValidationChange]);

  useEffect(() => {
    if (isTouched || forceShowError) {
      validate(value);
    }
  }, [value, isTouched, forceShowError, validate]);

  useEffect(() => {
    Animated.timing(borderAnimation, {
      toValue: error ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [error, borderAnimation]);

  const borderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,0,0,0.5)'],
  });

  const handleChangeText = (text: string) => {
    if (externalValue === undefined) {
      setInternalValue(text);
    }
    externalOnChangeText?.(text);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
        ]}
      >
        <TextInput
          {...props}
          secureTextEntry={isPasswordField && !showPassword}
          style={[styles.input, isPasswordField && styles.inputWithIcon, style]}
          onChangeText={handleChangeText}
          onBlur={() => setIsTouched(true)}
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={value}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={22} 
              color="rgba(255,255,255,0.7)" 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (isTouched || forceShowError) && (
        <Animated.Text style={[styles.errorText, { opacity: borderAnimation }]}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  inputContainer: {
    width: '100%',
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 12,
  },
  inputWithIcon: {
    paddingRight: 45,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});