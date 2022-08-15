import { atom } from "recoil";

export interface MemberState {
  id: string;
  email: string;
}

export const memberState = atom({
  key: "memberState",
  default: {
    id: "",
    email: "",
  },
});
