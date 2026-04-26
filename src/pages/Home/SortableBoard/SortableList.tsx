import { SortableCard } from './SortableCard';
import { AddCard } from './AddCard';
import type { List } from '../../../modules/lists/list.entity';
import { deleteListAtom } from '../../../modules/lists/current-lists';
import { useSetAtom } from 'jotai';
import { Draggable } from '@hello-pangea/dnd';

// リスト1つに対するコンポーネント

type SortableListProps = {
  list: List;
  deleteListRepository: (listId: string) => Promise<void>;
}
export function SortableList({ list, deleteListRepository }: SortableListProps) {
  const deleteList = useSetAtom(deleteListAtom);
  
  return (
    <Draggable draggableId={list.id} index={list.position}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps} // / Draggableとして必要な属性をまとめてDOMに設定
          ref={provided.innerRef} // DOM要素をライブラリに渡す
          style={{
            ...provided.draggableProps.style, // ドラッグ中のスタイル崩れを防ぐ
            opacity: snapshot.isDragging ? 0.8 : 1 // ドラッグ中は少し透明にする
          }}
        >
          <div className={`list`}>
              <div
                className="list-header"
                style={{ cursor: 'grab' }}
                {...provided.dragHandleProps} // ドラッグするときに掴める領域
              >
              <h3 className="list-title">{list.title}</h3>
              <button
                className="list-options"
                onClick={() => {
                  deleteListRepository(list.id)
                    .then(() => deleteList(list.id))
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
            <div style={{ minHeight: '1px' }}>
              <SortableCard />
            </div>
            <AddCard />
          </div>
        </div>
      )}
    </Draggable>
  );
}