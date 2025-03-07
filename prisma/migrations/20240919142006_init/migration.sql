-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookName" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_bookName_key" ON "Book"("bookName");
