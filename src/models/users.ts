import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { loginMsgs, UserLoginInfo } from "../utils/auth/usersModelConstants.js";
import { fetchedUser } from "../utils/auth/authConstants.js";

interface IUserDocument extends mongoose.Document {
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  login(userLoginInfo: UserLoginInfo): Promise<fetchedUser>;
}

const usersSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Please enter your password!"],
  },
});

// usersSchema.post("save", (doc: any) => {
//     console.log("New user was added", doc)
//     next();
// })

usersSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usersSchema.static(
  "login",
  async function login(userLoginInfo: UserLoginInfo): Promise<fetchedUser> {
    if ("email" in userLoginInfo && "password" in userLoginInfo) {
      const user = await User.findOne({ email: userLoginInfo["email"] });
      if (user) {
        const auth = await bcrypt.compare(
          userLoginInfo["password"] as string,
          user["password"]
        );
        if (auth) {
          return user;
        } else {
          throw new Error(loginMsgs.invPass);
        }
      } else {
        throw new Error(loginMsgs.invEmail);
      }
    } else {
      throw new Error(loginMsgs.invLoginInfo);
    }
  }
);

const User = mongoose.model<IUserDocument, IUserModel>("User", usersSchema);

export default User;
