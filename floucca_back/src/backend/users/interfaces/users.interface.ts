export interface User {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_email?: string;
    user_phone?: string;
    user_pass: string;
    last_login?: Date;
    creation_time?: Date;
  }
  