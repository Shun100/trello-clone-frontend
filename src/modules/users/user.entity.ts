export class User {
  id!: string;
  name!: string;
  email!: string;
  boardId!: string; // ユーザに対しボード(部屋のようなもの)を1つ割り当てる

  constructor(data: User) {
    Object.assign(this, data); 
  }
}