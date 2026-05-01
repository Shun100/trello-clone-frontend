import type { DraggableLocation } from "@hello-pangea/dnd";
import { Card } from "../../../modules/cards/card.entity";
import { List } from "../../../modules/lists/list.entity";
import * as ArrayUtil from '../../../utils/arrayUtil';
import { cardRepository } from "../../../modules/cards/card.repository";
import { listRepository } from "../../../modules/lists/list.repository";

/**
 * リスト ドラッグ終了時処理
 * リストをソートし直して、DBに登録 + global stateに反映する
 * @param { List[] } currentLists - 現在のリスト一覧
 * @param { (lists: List[]) => void } putState - global stateの更新処理
 * @param { DraggableLocation } src - ドラッグ前の位置情報
 * @param { DraggableLocation } dst - ドラッグ後の位置情報
 */
export async function handleListDragEnd (
  currentLists: List[],
  putState: (lists: List[]) => void,
  src: DraggableLocation,
  dst: DraggableLocation
) {
  const backup = currentLists.map(list => new List(list));

  // ソート処理
  const resorted = ArrayUtil
    .moveTo(currentLists, src.index, dst.index)
    .map((list, index) => new List({ ...list, position: index }));

  // 更新処理
  putState(resorted);
  listRepository
    .update(resorted)
    .catch(e => {
      putState(backup); // ロールバック
      console.error(e);
    });
}

/**
 * カード ドラッグ終了時処理 (同じリスト内での移動)
 * カードをソートし直して、DBに登録 + global stateに反映する
 * @param { Card[] } currentCards - 現在のカード一覧
 * @param { (cards: Card[]) => void } patchState - global stateの更新関数 (部分更新)
 * @param { (cards: Card[]) => void } putState - global stateの更新関数 (全体更新)
 * @param { DraggableLocation } src - ドラッグ前の位置情報 
 * @param { DraggableLocation } dst - ドラッグ後の位置情報
 */
async function handleCardDragEndWithinList (
  currentCards: Card[],
  patchState: (cards: Card[]) => void,
  putState: (cards: Card[]) => void,
  src: DraggableLocation,
  dst: DraggableLocation
) {
  const backup = currentCards.map(card => new Card(card));

  // ソート処理
  const resortTargets = currentCards.filter(card => card.listId === src.droppableId);
  const resorted = ArrayUtil
    .moveTo(resortTargets, src.index, dst.index)
    .map((card, index) => new Card({ ...card, position: index}));
  
  // 更新処理
  patchState(resorted);
  try {
    await cardRepository.update(resorted);
  } catch (e) {
    putState(backup); // ロールバック
    console.error(e);
  }
}

/**
 * カード ドラッグ終了時処理 (異なるリスト間での移動)
 * カードをソートし直して、DBに登録 + global stateに反映する
 * @param { Card[] } currentCards - 現在のカード一覧
 * @param { (cards: Card[]) => void } patchState - global stateの更新関数 (部分更新)
 * @param { (cards: Card[]) => void } putState - global stateの更新関数 (全体更新)
 * @param { DraggableLocation } src - ドラッグ前の位置情報 
 * @param { DraggableLocation } dst - ドラッグ後の位置情報
 */
async function handleCardDragEndAcrossList (
  currentCards: Card[],
  patchState: (cards: Card[]) => void,
  putState: (cards: Card[]) => void,
  src: DraggableLocation,
  dst: DraggableLocation
) {
  const backup = currentCards.map(card => new Card(card));

  // 移動対象のカードの情報を更新
  const target = new Card(currentCards.filter(card => card.listId === src.droppableId)[src.index]);
  target.listId = dst.droppableId;
  target.position = dst.index;

  // 移動対象以外のカード (src内) の情報を更新
  const othersInSrc = currentCards
    .filter(card => card.listId === src.droppableId)
    .filter(card => card.id !== target.id)
    .map((card, index) => new Card({ ...card, position: index}));
  
  // 移動対象以外のカード (dst内) の情報を更新
  const othersInDst = currentCards
    .filter(card => card.listId === dst.droppableId)
    .map((card, index) => new Card({ ...card, position: index < target.position ? index : index + 1}));
  
  // 更新処理
  const resorted = [target, ...othersInSrc, ...othersInDst];
  patchState(resorted);
  cardRepository
    .update(resorted)
    .catch(e => {
      putState(backup); // ロールバック
      console.error(e);
    });
}

export async function handleCardDragEnd(
  currentCards: Card[],
  patchState: (cards: Card[]) => void,
  putState: (cards: Card[]) => void,
  src: DraggableLocation,
  dst: DraggableLocation
) {
  if (src.droppableId === dst.droppableId) {
    await handleCardDragEndWithinList(currentCards, patchState, putState, src, dst);
  } else {
    await handleCardDragEndAcrossList(currentCards, patchState, putState, src, dst);
  }
}
