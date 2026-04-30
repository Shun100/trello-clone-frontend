import api from "../../lib/api";
import { Card } from "./card.entity";

export const cardRepository = {
  async create(listId: string, title: string) {
    const result = await api.post('/cards', { listId, title });
    return new Card(result.data);
  },
  async find(boardId: string) {
    const result = await api.get(`/cards/${boardId}`);
    return result.data.map((card: Card) => new Card(card));
  },
  async update(cards: Card[]): Promise<Card[]> {
    const result = await api.put(`/cards`, { cards });
    return result.data.map((card: Card) => new Card(card));
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/cards/${id}`);
  }
}