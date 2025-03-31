import { MigrationInterface, QueryRunner } from 'typeorm';

export class Brands1742617318633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const brands = [
      'FreeSpirit',
      'Ruby Star Society',
      'Robert Kaufman',
      'Moda',
      'Tilda',
    ];

    for (const brand of brands) {
      await queryRunner.query(`INSERT INTO brand (name) VALUES ('${brand}')`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM brand`);
  }
}
