// カード1枚を表すコンポーネント

import { useSetAtom } from "jotai";
import type { Card } from "../../../modules/cards/card.entity";
import { selectedCardIdAtom } from "../../../modules/cards/current-cards";
import * as dateUtil from "../../../utils/dateUtil";
import { Draggable } from "@hello-pangea/dnd";

type SortableCardProps = {
  card: Card;
}

export function SortableCard({ card }: SortableCardProps) {
  const setSelectedCardId = useSetAtom(selectedCardIdAtom);

  return (
    <Draggable draggableId={card.id} index={card.position}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef} // draggableのために必要な属性をDOMに設定する
          {...provided.draggableProps} // DOM要素をライブラリに渡す
          {...provided.dragHandleProps} // ドラッグ可能な要素に指定するためのProps
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
          }}
        >
          <div className={`card`} onClick={() => setSelectedCardId(card.id)}>
            <div className="card-title">
              <span className="card-check">
                {card.completed && <svg viewBox="0 0 24 24" width="16" height="16" fill="#4CAF50">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>}
              </span>
              ${card.title}
            </div>
            <div className="card-badge">
              🕒 {card.dueDate ? dateUtil.format(card.dueDate) : '期限を設定してください'}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
