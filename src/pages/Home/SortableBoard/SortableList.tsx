import { SortableCard } from './SortableCard';
import { AddCard } from './AddCard';
import type { List } from '../../../modules/lists/list.entity';
import { deleteListAtom } from '../../../modules/lists/current-lists';
import { useSetAtom } from 'jotai';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { Card } from '../../../modules/cards/card.entity';

// リスト1つに対するコンポーネント

type SortableListProps = {
  list: List;
  deleteListRepository: (listId: string) => Promise<void>;
  cards: Card[];
}

export function SortableList({ list, deleteListRepository, cards }: SortableListProps) {
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
            <Droppable droppableId={list.id} type="card">
              {provided => (
                <div
                  style={{ minHeight: '1px' }}
                  ref={provided.innerRef} // Droppableとして必要な属性をDOMに設定
                  {...provided.droppableProps} // DOM要素をライブラリに渡す
                >
                  {cards.map(card => <SortableCard key={card.id} card={card} />)}
                  {provided.placeholder}
                  {/* draggableの要素がドラッグされたときに、そこに空いた穴をplaceholderで埋めてスタイルが崩れないようにしてくれる */}
                </div>
              )}
            </Droppable>
            <AddCard listId={list.id}/>
          </div>
        </div>
      )}
    </Draggable>
  );
}