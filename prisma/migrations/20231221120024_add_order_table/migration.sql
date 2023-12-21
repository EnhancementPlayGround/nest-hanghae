-- CreateTable
CREATE TABLE "ordel" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ordel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordel_item" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ordel_id" TEXT NOT NULL,

    CONSTRAINT "ordel_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ordel_item" ADD CONSTRAINT "ordel_item_ordel_id_fkey" FOREIGN KEY ("ordel_id") REFERENCES "ordel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
