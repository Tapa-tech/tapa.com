-- CreateTable
CREATE TABLE "DharmicConcept" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT,
    CONSTRAINT "DharmicConcept_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DharmicConcept_slug_key" ON "DharmicConcept"("slug");

-- CreateIndex
CREATE INDEX "DharmicConcept_slug_idx" ON "DharmicConcept"("slug");

-- CreateIndex
CREATE INDEX "DharmicConcept_status_idx" ON "DharmicConcept"("status");

-- CreateIndex
CREATE INDEX "DharmicConcept_category_idx" ON "DharmicConcept"("category");

-- CreateIndex
CREATE INDEX "DharmicConcept_authorId_idx" ON "DharmicConcept"("authorId");

-- CreateIndex
CREATE INDEX "DharmicConcept_status_category_idx" ON "DharmicConcept"("status", "category");
