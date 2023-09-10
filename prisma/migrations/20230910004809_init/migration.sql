-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dayPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planID" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    CONSTRAINT "dayPlan_planID_fkey" FOREIGN KEY ("planID") REFERENCES "plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "moves" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "set" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "dayPlanId" TEXT NOT NULL,
    CONSTRAINT "moves_dayPlanId_fkey" FOREIGN KEY ("dayPlanId") REFERENCES "dayPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
