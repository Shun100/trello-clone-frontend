import { SortableList } from './SortableList';
import { AddList } from './AddList/index';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentListsAtom } from '../../../modules/lists/current-lists';
import { listRepository } from '../../../modules/lists/list.repository';
import { List } from '../../../modules/lists/list.entity';
import { currentUserAtom } from '../../../modules/auth/current-user.state';
import { useEffect } from 'react';
import { DragDropContext, Droppable, type DraggableLocation, type DropResult } from '@hello-pangea/dnd';
import * as ArrayUtil from '../../../utils/arrayUtil';
import { currentCardsAtom, updateCardsAtom } from '../../../modules/cards/current-cards';
import { cardRepository } from '../../../modules/cards/card.repository';
import { Card } from '../../../modules/cards/card.entity';

/*
 * カードとリスト全体 (= ボードのタイトルから下すべて)
 * 
 * 今回のルール
 *  - repositoryの関数はこの階層から呼ぶ 更に下位のコンポーネントから呼びだす場合はPropsとして渡す
 *    - 理由: SELECTはともかく、INSERT, UPDATE, DELETEといったDBに変更を加える処理は、あちこちから呼ぶとメンテナンスが難しくなるため
 */
export default function SortableBoard() {
  const currentUser = useAtomValue(currentUserAtom);
  const [currentLists, setCurrentLists] = useAtom(currentListsAtom);
  const [currentCards, setCurrentCards] = useAtom(currentCardsAtom);
  const updateCards = useSetAtom(updateCardsAtom);

  /**
   * リスト登録 (DB)
   * @param { string } title - タイトル 
   * @returns { Promise<list> } - 登録したリスト
   */
  const createListRepository = async (title: string): Promise<List> => {
    const boardId = currentUser!.boardId;
    const newList =  await listRepository.create(boardId, title);
    return newList;
  }

  /**
   * リスト削除 (DB)
   * @param { string } boardId - ボードID
   * @param { Promise<void> }
   */
  const deleteListRepository = async (boardId: string): Promise<void> => {
    await listRepository.delete(boardId);
  }

  /**
   * ドラッグ&ドロップ終了時処理
   * リストもしくはカードに応じた処理を行う
   * @param { DropResult } result - ドロップしたアイテムの情報
   */
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (destination === null) return;

    if (type === 'list') {
      await handleListDragEnd(source, destination);
    } else if (type === 'card') {
      if (source.droppableId === destination.droppableId) {
        // 同じリスト内での移動
        await handleCardDragEndWithinList(source, destination);
      } else {
        //リストを跨っての移動
        await handleCardDragEndAcrossList(source, destination);
      }
    }
  }

  /**
   * リスト ドラッグ&ドロップ終了時処理
   * 各リストに順番情報を設定し直し、DBに登録 + 画面に再描画する
   * @param { DraggableLocation } source - ドラッグ&ドロップ前の情報
   * @param { DraggableLocation } destination - ドラッグ&ドロップ後の情報
   */
  const handleListDragEnd = async (source: DraggableLocation, destination: DraggableLocation) => {
    const originalLists = currentLists.map(list => new List(list)); // ロールバック用
    const resortedLists = ArrayUtil
      .moveTo(currentLists, source.index, destination.index)
      .map((list, index) => new List({...list, position: index}));

    setCurrentLists(resortedLists);
    listRepository
      .update(resortedLists)
      .catch(error => {
        setCurrentLists(originalLists); // ロールバック
        console.error(error);
      });
  }

  /**
   * カード ドラッグ&ドロップ終了時処理 (同じリスト内で移動)
   * 各カードに順番情報を設定し直し、DBに登録 + 画面に再描画する
   * @param { DraggableLocation } source - ドラッグ&ドロップ前の情報
   * @param { DraggableLocation } destination - ドラッグ&ドロップ後の情報
   */
  const handleCardDragEndWithinList = async (source: DraggableLocation, destination: DraggableLocation) => {
    const originalCards = currentCards.map(card => new Card(card)); // ロールバック用
    let i = 0;
    const targetCards = currentCards.filter(card => card.listId === source.droppableId);
    const resortedCards = ArrayUtil
      .moveTo(targetCards, source.index, destination.index)
      .map(card => new Card({ ...card, position: i++ }));

    updateCards(resortedCards);
    cardRepository
      .update(resortedCards)
      .catch(error => {
        setCurrentCards(originalCards);
        console.error(error);
      }); 
  }

  /**
   * カード ドラッグ&ドロップ終了時処理 (異なるリスト間で移動)
   * 各カードに順番情報を設定し直し、DBに登録 + 画面に再描画する
   * 
   * ※ FIY
   *  List (Droppable) を跨ってCard (Draggable) を移動すると、positionとlistIdが自動的に更新される
   * 
   * @param { DraggableLocation } source - ドラッグ&ドロップ前の情報
   * @param { DraggableLocation } destination - ドラッグ&ドロップ後の情報
   */
  const handleCardDragEndAcrossList = async (source: DraggableLocation, destination: DraggableLocation) => {
    console.log(currentCards);
    const originalCards = currentCards.map(card => new Card(card));

    // 移動対象のカードの情報を更新
    const target = new Card (currentCards.filter(card => card.listId === source.droppableId)[source.index]);
    target.listId = destination.droppableId;
    target.position = destination.index;

    // 移動対象以外のカード (source list内)の情報を更新
    const othersInSrc = currentCards
      .filter(card => card.listId === source.droppableId)
      .filter(card => card.id !== target.id)
      .map((card, index) => new Card({ ...card, position: index }));


    // 移動対象以外のカード (destination list内)の情報を更新
    const othersInDst = currentCards
      .filter(card => card.listId === destination.droppableId)
      .map((card, index) => new Card({ ...card, position: index < target.position ? index : index + 1 }));

    const resortedCards = [target, ...othersInSrc, ...othersInDst];
    updateCards(resortedCards);
    cardRepository
      .update(resortedCards)
      .catch(error => {
        setCurrentCards(originalCards);
        console.error(error);
      }); 
  }

  // ページ初回読込時の処理
  useEffect(() => {
    if (!currentUser) {
      console.error('currentUser is undefined');
      return;
    }
    listRepository
      .find(currentUser.boardId)
      .then(setCurrentLists)
      .catch(console.error);
    cardRepository
      .find(currentUser.boardId)
      .then(setCurrentCards)
      .catch(console.error);
  }, [currentUser, setCurrentLists, setCurrentCards]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board-container">
        <Droppable droppableId="board" type="list" direction="horizontal">
          {provided => (
            <div style={{ display: 'flex', gap: '12px' }}
              {...provided.droppableProps} // Droppableとして必要な属性をまとめてDOMに設定
              ref={provided.innerRef} // DOM要素をライブラリに渡す
            >
              {currentLists?.map(list =>
                <SortableList
                  key={list.id}
                  list={list}
                  deleteListRepository={deleteListRepository}
                  cards={currentCards.filter(card => card.listId === list.id)}
                />
              )}
              {provided.placeholder} {/* ドラッグ中のスタイル崩れを防ぐ */}
            </div>
          )}
        </Droppable>
        <AddList createListRepository={createListRepository}/>
      </div>
    </DragDropContext>
  );
}