import React, { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { black, white } from '../utils/constants';
import { textStyle } from './ToDo';

interface FilterNameProps {
  name: string;
  onPress: () => void;
  selected: boolean;
}

const FilterName: React.FC<FilterNameProps> = ({ name, onPress, selected }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterButton, selected && styles.selected]}>
      <Text
        style={[
          styles.filterButtonText,
          selected ? styles.selectedText : textStyle,
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    borderRadius: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 0.5,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: black, 
  },
  selected: {
    backgroundColor: black,
    borderColor: white,
  },
  selectedText: {
    color: white,
  },
});

export default memo(FilterName);
