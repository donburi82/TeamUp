import {View, Text} from 'react-native';
import React, {useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

export default function BottomWindow() {
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = ['93%'];
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleComponent={null}
      style={{backgroundColor: 'red', borderRadius: 100}}
      backgroundStyle={{
        backgroundColor: '#f0f0f0',
      }}
      enablePanDownToClose={false} // Disables dragging down to close
      enableContentPanningGesture={false}>
      <Text>Awesome 🎉</Text>
    </BottomSheet>
  );
}
