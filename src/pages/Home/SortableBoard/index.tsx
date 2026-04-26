import { SortableList } from './SortableList';
import { AddList } from './AddList/index';
import { useAtom, useAtomValue } from 'jotai';
import { currentListsAtom } from '../../../modules/lists/current-lists';
import { listRepository } from '../../../modules/lists/list.repository';
import type { List } from '../../../modules/lists/list.entity';
import { currentUserAtom } from '../../../modules/auth/current-user.state';
import { useEffect } from 'react';

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

  const createListRepository = async (title: string): Promise<List> => {
    // WIP: boardIdを取得する
    const boardId = currentUser!.boardId;
    const newList =  await listRepository.create(boardId, title);
    return newList;
  }

  const deleteListRepository = async (boardId: string): Promise<void> => {
    await listRepository.delete(boardId);
  }

  // ページ初回読込時の処理
  useEffect(() => {
    if (!currentUser) {
      console.error('currentUser is undefined');
      return;
    }
    
    listRepository
      .find(currentUser!.boardId)
      .then(setCurrentLists)
      .catch(console.error);
  }, [currentUser, setCurrentLists]);

  return (
    <div className="board-container">
      {/* WIP: サンプルカードを追加 */}
      {currentLists?.map(list =>
        <div style={{ display: 'flex', gap: '12px' }}>
          <SortableList list={list} deleteListRepository={deleteListRepository} />
        </div>
      )}
      <AddList createListRepository={createListRepository}/>
    </div>
  );
}