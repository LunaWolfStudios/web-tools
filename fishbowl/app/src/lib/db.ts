import Dexie, { Table } from 'dexie';
import { Cocktail, Menu } from '../types';

export class FishBowlDB extends Dexie {
  cocktails!: Table<Cocktail, string>;
  menus!: Table<Menu, string>;

  constructor() {
    super('FishBowlDB');
    this.version(1).stores({
      cocktails: 'id, name, family, type',
      menus: 'id, name',
    });
  }
}

export const db = new FishBowlDB();

export async function resetDatabase() {
  await db.delete();
  db.open();
}
