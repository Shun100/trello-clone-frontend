/**
 * 要素の移動
 * @param { T[] } array - 対象の配列
 * @param { number } indexFrom - 移動元のインデックス
 * @param { number } indexTo - 移動先のインデックス
 * @returns { T[] } - 並び変え後の配列
 */
export function moveTo<T> (array: T[], indexFrom: number, indexTo: number): T[] {
  const target = array[indexFrom];
  const without = array.filter((_, i) => i !== indexFrom);

  const resortedArray = [
    ...without.slice(0, indexTo),
    target,
    ...without.slice(indexTo)
  ];

  return resortedArray;
}