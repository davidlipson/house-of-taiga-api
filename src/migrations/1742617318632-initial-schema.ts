import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1742617318632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return;

    // tag table
    await queryRunner.query(`CREATE TABLE "tag" (
            "id" SERIAL NOT NULL,
            "name" VARCHAR(30) NOT NULL,
            CONSTRAINT "UQ_tag_name" UNIQUE ("name"),
            CONSTRAINT "PK_tag" PRIMARY KEY ("id")
        )`);

    // bins table
    await queryRunner.query(`CREATE TABLE "bin" (
            "id" SERIAL NOT NULL,
            "name" VARCHAR(30) NOT NULL,
            CONSTRAINT "UQ_bin_name" UNIQUE ("name"),
            CONSTRAINT "PK_bin" PRIMARY KEY ("id")
        )`);

    // brands table
    await queryRunner.query(`CREATE TABLE "brand" (
            "id" SERIAL NOT NULL,
            "name" VARCHAR(30) NOT NULL,
            CONSTRAINT "UQ_brands_name" UNIQUE ("name"),
            CONSTRAINT "PK_brands" PRIMARY KEY ("id")
        )`);

    // inventory table
    await queryRunner.query(`CREATE TABLE "inventory" (
            "id" SERIAL NOT NULL,
            "name" VARCHAR(30) NOT NULL,
            "brandId" INTEGER NOT NULL,
            "binId" INTEGER NOT NULL,
            "colour" VARCHAR(30),
            "cost" FLOAT NOT NULL,
            "quantity" INTEGER NOT NULL,
            "fileUrl" VARCHAR(255),
            CONSTRAINT "UQ_inventory_name" UNIQUE ("name"),
            CONSTRAINT "PK_inventory" PRIMARY KEY ("id"),
            CONSTRAINT "FK_inventory_brandId" FOREIGN KEY ("brandId") REFERENCES "brand"("id"),
            CONSTRAINT "FK_inventory_binId" FOREIGN KEY ("binId") REFERENCES "bin"("id")
        )`);

    // inventory_tag table
    await queryRunner.query(`CREATE TABLE "inventoryTag" (
            "inventoryId" INTEGER NOT NULL,
            "tagId" INTEGER NOT NULL,
            CONSTRAINT "PK_inventoryTag" PRIMARY KEY ("inventoryId", "tagId"),
            CONSTRAINT "FK_inventoryTag_inventoryId" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id"),
            CONSTRAINT "FK_inventoryTag_tagId" FOREIGN KEY ("tagId") REFERENCES "tag"("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inventoryTag"`);
    await queryRunner.query(`DROP TABLE "inventory"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "bin"`);
    await queryRunner.query(`DROP TABLE "brand"`);
  }
}
