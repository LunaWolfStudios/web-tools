export type ItemStatus = 'need' | 'purchased';

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  lastUsed: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  items: Item[];
}

export interface AppSettings {
  sound: boolean;
  darkMode: boolean;
}

export interface AppData {
  categories: Category[];
  recentItems: string[]; // Just names of frequently used items
  settings: AppSettings;
}

export type ActionType = 
  | { type: 'ADD_ITEM'; payload: { categoryId: string; name: string } }
  | { type: 'MOVE_ITEM'; payload: { categoryId: string; itemId: string; toStatus: ItemStatus } }
  | { type: 'DELETE_ITEM'; payload: { categoryId: string; itemId: string } }
  | { type: 'ADD_CATEGORY'; payload: { name: string; color: string } }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; name: string; color: string } }
  | { type: 'IMPORT_DATA'; payload: AppData }
  | { type: 'RESET_LIST'; }
  | { type: 'CLEAR_PURCHASED'; categoryId?: string }; // Optional categoryId to clear specific category
