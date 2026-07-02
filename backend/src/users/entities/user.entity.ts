export class User {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  is_active!: boolean;
  createdOn!: Date;
  updatedOn?: Date;
  deletedOn?: Date;
}
