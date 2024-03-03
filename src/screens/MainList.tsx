import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RefreshControl} from 'react-native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  deleteToDo,
  fetchToDoList,
  initialStateType,
  updateToDo,
  addToDo,
} from '../store/TodoSlice';
import ToDo, {textStyle} from '../components/ToDo';
import FilterName from '../components/FilterName';
import {black, white} from '../utils/constants';
import moment from 'moment';

interface MainListProps {
  navigation: NativeStackNavigationProp<any>;
}

const MainList: React.FunctionComponent<MainListProps> = ({navigation}) => {
  const toDoList = useSelector((state: {Todo: initialStateType}) => state.Todo);
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState<string>('Recent');

  useEffect(() => {
    dispatch(fetchToDoList());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchToDoList());
  };

  const filteredList = () => {
    switch (selectedFilter) {
      case 'Completed':
        return toDoList.ToDoList.filter(item => item.completed);
      case 'Recent':
        return [...toDoList.ToDoList].sort((a, b) => b.id - a.id);
      case 'Oldest':
        return [...toDoList.ToDoList].sort((a, b) => a.id - b.id);
      default:
        return toDoList.ToDoList;
    }
  };

  const ListHeaderComponent = () => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#e5e5e5',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 60,
      }}>
      <View style={[styles.filterContainer]}>
        {['Completed', 'Recent', 'Oldest'].map(
          (name: string, index: number) => (
            <FilterName
              name={name}
              key={index}
              onPress={() => setSelectedFilter(name)}
              selected={selectedFilter === name}
            />
          ),
        )}
      </View>
      <View>
        <Text style={textStyle}>
          Total Todos:{' '}
          <Text style={{fontWeight: 'bold', color: '#000'}}>
            {toDoList.ToDoList.length}
          </Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {toDoList.ToDoList.length == 0 ? (
          <View style={{flex: 1}}>
            <Image
              source={require('./../assets/Select.png')}
              style={{height: '60%', width: '60%', alignSelf: 'center'}}
              resizeMode="contain"
            />
            <Text
              style={[
                {textAlign: 'center', fontSize: 24, fontWeight: '700'},
                textStyle,
              ]}>
              Add Some To Do's
            </Text>
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={toDoList.loading}
                onRefresh={onRefresh}
              />
            }
            data={filteredList()}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.listContent}
            renderItem={({item}) => {
              return (
                <ToDo
                  title={item.title}
                  completed={item.completed}
                  created_at={item.created_at}
                  updated_at={item.updated_at}
                  onDelete={() => {
                    dispatch(deleteToDo(item.id));
                  }}
                  onUpdate={() => {
                    if (item.completed === false) {
                      navigation.navigate('AddToDo', {item});
                    }
                  }}
                  onPressChecked={() => {
                    dispatch(
                      updateToDo({
                        ...item,
                        completed: !item.completed,
                        updated_at: moment().format('lll'),
                      }),
                    );
                  }}
                />
              );
            }}
            keyExtractor={item => item.id.toString()}
          />
        )}

        <Pressable
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('AddToDo');
          }}>
          <Text style={styles.addButtonText}>Add To-Do</Text>
          <Image
            source={require('./../assets/plus.png')}
            style={styles.addButtonIcon}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  mainContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: black,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: white,
    marginRight: 10,
  },
  addButtonIcon: {
    height: 15,
    width: 15,
    tintColor: white,
  },
  filterButton: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
  },
  activeFilterButton: {
    backgroundColor: '#e5e5e5',
  },
  filterButtonText: {
    color: black,
    marginRight: 5,
  },
  filterButtonIcon: {
    height: 20,
    width: 20,
    tintColor: black,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    height: '100%',
  },
});

export default MainList;
