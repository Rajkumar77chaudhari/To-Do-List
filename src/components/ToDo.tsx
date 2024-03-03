import React, { useState, memo } from 'react';
import { Pressable, Text, View, StyleSheet, Image, TextStyle } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { black, white } from '../utils/constants';

export interface ToDoProps {
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  onDelete: () => void;
  onUpdate: () => void;
  onPressChecked: () => void;
}

export const textStyle: TextStyle = {
  color: black,
};

const ToDo: React.FunctionComponent<ToDoProps> = ({
  title,
  completed,
  created_at,
  updated_at,
  onDelete,
  onUpdate,
  onPressChecked,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(completed);

  return (
    <Pressable onPress={onUpdate} style={styles.container}>
      <View style={styles.checkboxContainer}>
        <BouncyCheckbox
          isChecked={isChecked}
          onPress={(isChecked: boolean) => {
            setIsChecked(isChecked);
            onPressChecked();
          }}
          fillColor={black}
          disableText={true}
          iconStyle={{
            borderColor: isChecked ? black : '#ccc',
          }}
          size={25}
          style={{ padding: 5 }}
        />
        <View style={{ flex: 1, marginLeft:8 }}>
          <Text
            style={[
              styles.title,
              { textDecorationLine: isChecked ? 'line-through' : 'none' },
            ]}>
            {title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Image
              source={require('./../assets/clock.png')}
              style={{ width: 12, height: 12, tintColor: '#888', marginRight: 5 }}
            />
            <Text style={[textStyle, styles.timeStampText]}>{created_at}</Text>
          </View>
          {updated_at ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('./../assets/refresh.png')}
                style={{ width: 12, height: 12, tintColor: '#888', marginRight: 5 }}
              />
              <Text style={[textStyle, styles.timeStampText]}>
                {updated_at}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <Pressable onPress={onDelete} style={styles.deleteContainer}>
        <Image
          source={require('./../assets/delete.png')}
          style={{ height: 25, width: 25, tintColor: '#FF6868' }}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: black,
  },
  deleteContainer: {
    padding: 10,
    backgroundColor: '#ffebeb',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeStampText: {
    fontSize: 12,
    color: '#888',
  },
});

export default memo(ToDo);
