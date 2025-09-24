import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Dimensions,
  type ViewStyle,
} from 'react-native';

type ToastType = 'success' | 'error' | 'info';
type ToastPosition = 'top' | 'bottom' | 'center';

export type ToastConfig = {
  id?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  containerStyle?: ViewStyle;
};
interface IToastContext {
  showToast: (config: ToastConfig) => void;
}
const ToastContext = createContext<IToastContext>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((config: ToastConfig) => {
    const id = config.id ?? Date.now().toString();
    const toast: ToastConfig = { ...config, id };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, config.duration ?? 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {['top', 'center', 'bottom'].map((pos) => (
        <View
          key={pos}
          pointerEvents="box-none"
          style={[
            styles.container,
            pos === 'top' && { top: 80, justifyContent: 'flex-start' },
            pos === 'center' && {
              top: '50%',
              transform: [{ translateY: -50 }],
            },
            pos === 'bottom' && { bottom: 80, justifyContent: 'flex-end' },
          ]}
        >
          {toasts
            .filter((t) => (t.position ?? 'bottom') === pos)
            .map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onDismiss={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
              />
            ))}
        </View>
      ))}
    </ToastContext.Provider>
  );
}
export type ToastHandle = {
  showToast: (config: ToastConfig) => void;
};
export const Toast = forwardRef<ToastHandle, { children?: React.ReactNode }>(
  ({}, ref) => {
    const [toasts, setToasts] = useState<ToastConfig[]>([]);

    const showToast = useCallback((config: ToastConfig) => {
      const id = config.id ?? Date.now().toString();
      const toast: ToastConfig = { ...config, id };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, config.duration ?? 2500);
    }, []);
    // expose method via ref
    useImperativeHandle(ref, () => ({
      showToast: showToast,
    }));
    return (
      <>
        {['top', 'center', 'bottom'].map((pos) => (
          <View
            key={pos}
            pointerEvents="box-none"
            style={[
              styles.container,
              pos === 'top' && { top: 80, justifyContent: 'flex-start' },
              pos === 'center' && {
                top: '50%',
                transform: [{ translateY: -50 }],
              },
              pos === 'bottom' && { bottom: 80, justifyContent: 'flex-end' },
            ]}
          >
            {toasts
              .filter((t) => (t.position ?? 'bottom') === pos)
              .map((toast) => (
                <ToastItem
                  key={toast.id}
                  toast={toast}
                  onDismiss={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                />
              ))}
          </View>
        ))}
      </>
    );
  }
);
export function useToast() {
  return useContext(ToastContext);
}

export function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastConfig;
  onDismiss: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 100) {
          Animated.timing(translateX, {
            toValue: g.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(onDismiss);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.toast,
        {
          backgroundColor:
            toast.type === 'success'
              ? '#4CAF50'
              : toast.type === 'error'
                ? '#F44336'
                : '#333',
          opacity,
          transform: [{ translateY }, { translateX }],
        },
        toast.containerStyle,
      ]}
    >
      {typeof toast.message === 'string' ? (
        <Text style={styles.text}>{toast.message}</Text>
      ) : (
        toast.message
      )}
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    minWidth: width * 0.6,
    maxWidth: width * 0.9,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  text: { color: 'white', fontWeight: '600', textAlign: 'center' },
});
