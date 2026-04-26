import { useState } from "react";
import { AddListForm } from "./AddListForm";
import { AddListButton } from "./AddListButton";
import { addListAtom } from "../../../../modules/lists/current-lists";
import { useSetAtom } from "jotai";
import type { List } from "../../../../modules/lists/list.entity";

// 「カードを追加」ボタン押下で表示するリスト登録画面

type AddListProps = {
  createListRepository: (title: string) => Promise<List>;
}

export function AddList({ createListRepository }: AddListProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const addList = useSetAtom(addListAtom);

  const createList = async (): Promise<void> => {
    const newList = await createListRepository(title);
    addList(newList);
  }

  return (
    <>
      {showForm
        ?
        <AddListForm
          closeAddListForm={() => setShowForm(false)}
          createList={createList}
          setTitle={setTitle}
        />
        :
        <AddListButton openAddListForm={() => setShowForm(true)} />
      }
    </>
  );
}