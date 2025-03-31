import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bins1743433693456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows = ['A', 'B', 'C'];
    const cols = ['1', '2', '3'];
    for (const row of rows) {
      for (const col of cols) {
        await queryRunner.query(
          `INSERT INTO bin (name) VALUES ('${row}${col}')`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM bin`);
  }
}
