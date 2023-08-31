// A day for remaining logged in
export const maxAgeJwt = 24 * 60 * 60;
export const maxAgeCookies = 24 * 60 * 60 * 1000;
export const duplicateCode = 11000;

export type fetchedUser = {
  _id: string;
  email: string;
  password: string;
  __v?: number;
};
