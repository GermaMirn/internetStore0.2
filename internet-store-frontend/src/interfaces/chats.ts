import { Profile } from ".";


export interface Chat {
  id: number;
  participants: Profile[];
  created_at: string;
  messages: Message[];
}


export interface Message {
  id: number;
  chat: number;
  sender: Profile;
  text: string | null;
  image: string | null;
  created_at: string;
  is_read: boolean;
}
