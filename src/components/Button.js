import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Button — variants: 'primary' | 'outline' | 'danger' | 'ghost'
 */
const Button = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#4F46E5' : '#FFFFFF'}
        />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={variant === 'outline' || variant === 'ghost' ? '#4F46E5' : '#FFFFFF'}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },

  // variants
  primary: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
  },
  danger: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  ghost: {
    backgroundColor: '#EEF2FF',
  },
  disabled: {
    opacity: 0.55,
  },

  // text variants
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryText: { color: '#FFFFFF' },
  outlineText: { color: '#4F46E5' },
  dangerText: { color: '#FFFFFF' },
  ghostText: { color: '#4F46E5' },
});

export default Button;
