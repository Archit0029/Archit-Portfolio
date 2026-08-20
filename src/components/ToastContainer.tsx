import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import type { AppTheme } from '../theme/colors';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

const toastQueue: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  const id = Date.now().toString();
  const toast: Toast = { id, message, type };
  
  toastQueue.push(toast);
  notifyListeners();

  setTimeout(() => {
    const index = toastQueue.findIndex((t) => t.id === id);
    if (index !== -1) {
      toastQueue.splice(index, 1);
      notifyListeners();
    }
  }, duration);
}

function notifyListeners() {
  listeners.forEach((listener) => listener([...toastQueue]));
}

function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

type ToastContainerProps = {
  theme: AppTheme;
};

export function ToastContainer({ theme }: ToastContainerProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribe((updatedToasts) => setToasts(updatedToasts));
  }, []);

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} theme={theme} />
      ))}
    </View>
  );
}

type ToastProps = {
  toast: Toast;
  theme: AppTheme;
};

function Toast({ toast, theme }: ToastProps) {
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2700);

    return () => clearTimeout(timer);
  }, [opacityAnim]);

  const bgColor =
    toast.type === 'success'
      ? '#10b981'
      : toast.type === 'error'
        ? '#ef4444'
        : theme.accent;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: bgColor, opacity: opacityAnim },
      ]}
    >
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingHorizontal: 16,
    zIndex: 9999,
    pointerEvents: 'none',
  },
  toast: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  toastText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
