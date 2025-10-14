export class User {
  email!: string;
  name!: string;
  surname!: string;
  phoneNumber!: string;
  role!: string;
}

export class SimpleUser {
  email!: string;
  name!: string; // combined name and surname or business name
}
