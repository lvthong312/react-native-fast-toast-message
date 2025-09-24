import { useRef } from 'react';
import { Button, Text, View } from 'react-native';
import {
  ToastProvider,
  useToast,
  Toast,
  ToastHandle
} from 'react-native-fast-toast-message';
function Home() {
  const { showToast } = useToast<ToastHandle>();
  const toastRef = useRef(null);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <Button
        title="Top Toast"
        onPress={() =>
          showToast({
            message: 'This is top toast 👆',
            type: 'info',
            position: 'top',
          })
        }
      />
      <Button
        title="Center Toast"
        onPress={() =>
          showToast({
            message: (
              <View>
                <Text>aasads</Text>
              </View>
            ),
            type: 'success',
            position: 'center',
          })
        }
      />
      <Button
        title="Bottom Toast"
        onPress={() =>
          showToast({
            message: 'Bottom toast 👇',
            type: 'error',
            position: 'bottom',
          })
        }
      />
      <Button
        title="Ref Toast"
        onPress={() =>
          toastRef?.current?.showToast({
            message: (
              <View>
                <Text>aasads</Text>
              </View>
            ),
            type: 'success',
            position: 'bottom',
          })
        }
      />
      <Toast ref={toastRef} />
    </View>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  );
}
