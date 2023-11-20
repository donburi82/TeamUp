import React from 'react';
import {useState} from 'react';
import {Button, ButtonText, ButtonSpinner} from '@gluestack-ui/themed';
export default function DebouncedWaitingButton(props) {
  let options = {...props};
  let {onPress: handle, text} = options;
  delete options.handle;
  let [loading, setLoading] = useState(false);
  const clickHandle = async () => {
    setLoading(true);
    try {
      await handle();
    } catch (err) {
      console.log('this is in debounced button we got error', err);
    }
    setLoading(false);
  };
  if (handle) options.onPress = clickHandle;

  return loading ? (
    <Button {...options} isDisabled={true} opacity={0.4}>
      <ButtonSpinner mr="$1" />
      <ButtonText fontSize="$xl">{text}</ButtonText>
    </Button>
  ) : (
    <Button {...options}>
      <ButtonText fontSize="$xl">{text}</ButtonText>
    </Button>
  );
}
