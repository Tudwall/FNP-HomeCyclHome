export class User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  is_active!: string;
  createdOn!: Date;
  updatedOn?: Date;
  deletedOn?: Date;
}
