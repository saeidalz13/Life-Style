export const loginMsgs = {
    invEmail: "Username with this email does NOT exist!",
    invPass: "Wrong password; Try again please!",
    invLoginInfo: "Invalid user login info!"
}

export type UserLoginInfo = {
    email: string;
    password: string
}