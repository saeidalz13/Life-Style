import mongoose from "mongoose";


export interface IBudgetDocument extends mongoose.Document {
  author: mongoose.Schema.Types.ObjectId,
  startDate: string;
  endDate: string;
  income: number;
  savings: number;
  capital: number;
  entertainment: number;
  eatout: number;
  budgetID: string;
  capitalBalance: number;
  entertainmentBalance: number;
  eatoutBalance: number
}

interface IBudgetModel extends mongoose.Model<IBudgetDocument> {}

const budgetSchema = new mongoose.Schema<IBudgetDocument, IBudgetModel>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" 
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    income: {
      type: Number,
      required: true,
    },

    savings: {
      type: Number,
      required: true,
    },

    capital: {
      type: Number,
      required: true,
    },

    entertainment: {
      type: Number,
      required: true,
    },

    eatout: {
      type: Number,
      required: true,
    },

    budgetID: {
      type: String,
      unique: true,
    },

    capitalBalance: Number,
    entertainmentBalance: Number,
    eatoutBalance: Number
    
  },
  { timestamps: true }
);

budgetSchema.pre("save", function (next) {
  this.budgetID = `${this.startDate}_${this.endDate}`;
  this.capitalBalance = this.capital;
  this.entertainmentBalance = this.entertainment;
  this.eatoutBalance = this.eatout;

  const createdAttrs: (string | number)[] = [
    this.budgetID, 
    this.capitalBalance,
    this.entertainmentBalance,
    this.eatoutBalance
  ]
  if (createdAttrs) {
    console.log("Additional attrs were added successfully!")
  } else {
    console.log("Addition of attrs for Budget schema failed!"); 
  }
  next();
});


budgetSchema.post("save", function () {
  console.log(`Budget saved - ID:${this.budgetID}`);
  console.log(this)

});


const Budget = mongoose.model<IBudgetDocument>("Budget", budgetSchema);

export default Budget;
