// stores/data.store.ts
import { signal, computed } from '@preact/signals-core';

interface DataStore {
  data: any[] | null;
  hasData: boolean;
}

class AppStore {
  private static instance: AppStore;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  // Existing signals
  public readonly csvData = signal<any[] | null>(null);
  public readonly hasData = computed(() => {
    return this.csvData.value !== null && this.csvData.value.length > 0;
  });

  // Additional signals
  public readonly isGenerating = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  public setData(data: any[] | null) {
    this.csvData.value = data;
  }

  public getData(): any[] | null {
    return this.csvData.value;
  }

  public clear() {
    this.csvData.value = null;
    this.error.value = null;
  }

  public setError(error: string | null) {
    this.error.value = error;
  }

  public setGenerating(isGenerating: boolean) {
    this.isGenerating.value = isGenerating;
  }

    // Add code-related signals
    public readonly codeContent = signal<{
      html: string;
      css: string;
      javascript: string;
      combinedCode: string;
    }>({
      html: '',
      css: '',
      javascript: '',
      combinedCode: ''
    });

    public setCodeContent(content: {
      html: string;
      css: string;
      javascript: string;
      combinedCode: string;
    }) {
      this.codeContent.value = content;
    }
}

export const dataStore = AppStore.getInstance();
