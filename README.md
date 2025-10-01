# react-native-fast-toast-message
<p align="center">
  <img src="https://img.shields.io/npm/v/react-native-fast-toast-message?color=green" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/react-native-fast-toast-message" alt="npm downloads" />
  <img src="https://img.shields.io/badge/react--native-0.70+-blue" alt="react-native" />
</p>

Support for Toast

## Installation


```sh
npm install react-native-fast-toast-message
```


## Usage


```js
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

```


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
