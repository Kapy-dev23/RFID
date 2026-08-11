export interface AccessLog {

  _id: string;

  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };

  door: {
    _id: string;
    name: string;
    room: {
      _id: string;
      name: string;
    };
  };

  date: string;

  type: "enter" | "exit" | "move";

  authorised: boolean;

  createdAt?: string;

  updatedAt?: string;

}