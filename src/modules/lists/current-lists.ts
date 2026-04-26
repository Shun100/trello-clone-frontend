import { atom } from "jotai";
import type { List } from "./list.entity";

export const currentListsAtom = atom<List[]>([]);

/**
 * atom
 * @param { null } initialValue
 * @param { Write<[newList: List], void> } setter
 */
export const addListAtom = atom(
  null,
  (get, set, newList: List) => {
    const prev = get(currentListsAtom);
    set(currentListsAtom, [...prev, newList]);
  }
);

export const deleteListAtom = atom(
  null,
  (get, set, listId: string) => {
    const prev = get(currentListsAtom);
    set(currentListsAtom, prev.filter(list => list.id !== listId));
  }
);
