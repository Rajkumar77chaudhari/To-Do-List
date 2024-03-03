import React, {useState, useEffect, useRef} from 'react';
import {Pressable, SafeAreaView, Text, TextInput, View} from 'react-native';
import {black, white} from '../utils/constants';
import {useDispatch} from 'react-redux';
import {addToDo, updateToDo} from '../store/TodoSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {textStyle} from '../components/ToDo';

interface AddToDoProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
}

const AddToDo: React.FunctionComponent<AddToDoProps> = ({
  navigation,
  route,
}) => {
  const [value, setValue] = useState<string>(route?.params?.item?.title || '');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current?.focus();
    navigation.setOptions({
      headerTitle: route?.params?.item ? 'Update To-Do' : 'Add To-Do',
    });
  }, [navigation, route]);

  const submitToDo = () => {
    if (route?.params?.item) {
      dispatch(
        updateToDo({
          ...route.params.item,
          title: value,
          updated_at: new Date().toDateString(),
        }),
      );
    } else {
      dispatch(addToDo(value));
    }
    navigation.navigate('ToDoList');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingHorizontal: 20, justifyContent: 'center'}}>
        <Text style={{marginBottom: 10, color: black}}>
          {route?.params?.item ? 'Update To-Do:' : 'Add To-Do:'}
        </Text>
        <TextInput
          ref={inputRef}
          placeholder="Enter To-Do"
          value={value}
          placeholderTextColor={black}
          onChangeText={text => setValue(text)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
          style={[
            {
              borderWidth: isFocus ? 1 : 0.5,
              borderColor: isFocus ? black : '#ccc',
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            },
            textStyle,
          ]}
        />
        <Pressable
          style={{
            backgroundColor: black,
            padding: 12,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={submitToDo}>
          <Text style={{color: white}}>
            {route?.params?.item ? 'Update' : 'Add'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddToDo;
