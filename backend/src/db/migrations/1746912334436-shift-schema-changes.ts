import { MigrationInterface, QueryRunner } from "typeorm";

export class ShiftSchemaChanges1746912334436 implements MigrationInterface {
    name = 'ShiftSchemaChanges1746912334436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`dayOfWeek\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`dayOfWeek\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`dayOfWeek\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`dayOfWeek\` varchar(15) NOT NULL`);
    }

}
