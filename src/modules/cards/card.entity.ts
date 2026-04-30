export class Card {
  id!: string;
  title!: string;
  position!: number;
  description!: string;
  dueDate!: Date;
  completed!: boolean;
  listId!: string;

  constructor(data: Card) {
    Object.assign(this, data);

    if (!(data.dueDate instanceof Date)) {
      this.dueDate = new Date(data.dueDate);
    }
  }
}