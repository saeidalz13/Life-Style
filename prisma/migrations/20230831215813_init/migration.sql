/*
  Warnings:

  - You are about to drop the `DayPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Moves` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DayPlan";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Moves";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Plan";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "plan" (
    "title" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dayPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "planTitle" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    CONSTRAINT "dayPlan_planTitle_fkey" FOREIGN KEY ("planTitle") REFERENCES "plan" ("title") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "moves" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "set" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "dayPlanId" INTEGER NOT NULL,
    CONSTRAINT "moves_dayPlanId_fkey" FOREIGN KEY ("dayPlanId") REFERENCES "dayPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
