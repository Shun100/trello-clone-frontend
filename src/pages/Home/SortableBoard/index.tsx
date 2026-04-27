import { SortableList } from './SortableList';
import { AddList } from './AddList/index';
import { useAtom, useAtomValue } from 'jotai';
import { currentListsAtom } from '../../../modules/lists/current-lists';
import { listRepository } from '../../../modules/lists/list.repository';
import { List } from '../../../modules/lists/list.entity';
import { currentUserAtom } from '../../../modules/auth/current-user.state';
import { useEffect } from 'react';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as ArrayUtil from '../../../utils/arrayUtil';
import { currentCardsAtom } from '../../../modules/cards/current-cards';
import { cardRepository } from '../../../modules/cards/card.repository';

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

  const createListRepository = async (title: string): Promise<List> => {
    const boardId = currentUser!.boardId;
    const newList =  await listRepository.create(boardId, title);
    return newList;
  }

  const deleteListRepository = async (boardId: string): Promise<void> => {
    await listRepository.delete(boardId);
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (destination === null) { return ;}

    const originalLists = currentLists.map(list => new List(list)); // ロールバック用
    const resortedLists = ArrayUtil
      .moveTo(currentLists, source.index, destination.index)
      .map((list, index) => new List({...list, position: index}));

    /*
     * DB更新 -> 画面更新 版
     * DBがマスターデータを持つので通常はこの順だが、画面のレスポンスが悪くなるので今回は不採用
     */
    // listRepository.update(resortedLists)
    //   .then(() => setCurrentLists(resortedLists))
    //   .catch(error => console.error(error));

    /*
     * 画面更新 -> DB更新 版
     * 先に画面を更新するのでレスポンスを損なわない 今回はこちらを採用
     */
    setCurrentLists(resortedLists);
    listRepository.update(resortedLists)
      .catch(error => {
        setCurrentLists(originalLists); // ロールバック
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