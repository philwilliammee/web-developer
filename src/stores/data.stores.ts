// stores/data.store.ts
import { signal, computed } from '@preact/signals-core';

interface DataStore {
  data: any[] | null;
  hasData: boolean;
}

class DataStoreManager {
  private static instance: DataStoreManager;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): DataStoreManager {
    if (!DataStoreManager.instance) {
      DataStoreManager.instance = new DataStoreManager();
    }
    return DataStoreManager.instance;
  }

  public readonly csvData = signal<any[] | null>(null);

  public readonly hasData = computed(() => {
    return this.csvData.value !== null && this.csvData.value.length > 0;
  });

  public setData(data: any[] | null) {
    this.csvData.value = data;
  }

  public getData(): any[] | null {
    return this.csvData.value;
  }

  public clear() {
    this.csvData.value = null;
  }
}

export const dataStore = DataStoreManager.getInstance();
