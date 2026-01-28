// src/components/history/HistoryList.tsx
import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import HistoryCard from './HistoryCard';
import EmptyHistory from './EmptyHistory';
import HistoryFilters, { FilterType } from './filters/HistoryFilters';
import { HistoryItem } from '../../services/historyStorageService';

interface HistoryListProps {
  items: HistoryItem[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onItemPress: (item: HistoryItem) => void;
  onStartDetection: () => void;
  onDeleteItem?: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  loading?: boolean;
  refreshControl?: React.ReactElement;
}

const HistoryList: React.FC<HistoryListProps> = ({
  items,
  activeFilter,
  onFilterChange,
  onItemPress,
  onStartDetection,
  onDeleteItem,
  onFavoriteToggle,
  loading = false,
  refreshControl,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    filtersContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
  }));

  if (items.length === 0) {
    return <EmptyHistory onStartDetection={onStartDetection} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <HistoryFilters
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() => onItemPress(item)}
            onFavoriteToggle={onFavoriteToggle}
          />
        )}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      />
    </View>
  );
};

export default HistoryList;