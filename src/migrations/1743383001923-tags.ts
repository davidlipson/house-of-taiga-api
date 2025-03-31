import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tags1743383001923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tags = ['Animals', 'Floral', 'Geometric', 'Polka Dots'];
    for (const tag of tags) {
      await queryRunner.query(`INSERT INTO tag (name) VALUES ('${tag}')`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM tag`);
  }
}
