import React from 'react';
import {useState} from 'react';
import {Text} from 'react-native';
import {Button, ButtonText, ButtonSpinner} from '@gluestack-ui/themed';
export default function DebouncedWaitingButton(props) {
  let options = {...props};
  let {onPress: handle, text, fontSize} = options;
  delete options.onPress;
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
  function ReturnText({fontSize}) {
    if (fontSize === '$md') {
      return <Text style={{fontSize: 15, color: 'white'}}>{text}</Text>;
    }
    if (fontSize === '$sm') {
      return <Text style={{fontSize: 12, color: 'white'}}>{text}</Text>;
    }
    return <Text style={{fontSize: 20, color: 'white'}}>{text}</Text>;
  }
  return loading ? (
    <Button {...options} isDisabled={true} opacity={0.4}>
      <ButtonSpinner mr="$1" />
      {/* <ButtonText fontSize={fontSize || '$xl'}>{text} </ButtonText> */}
      <ReturnText fontSize={fontSize} />
    </Button>
  ) : (
    <Button {...options}>
      {/* <ButtonText fontSize={fontSize || '$xl'}>{text} </ButtonText> */}
      <ReturnText fontSize={fontSize} />
    </Button>
  );
}
