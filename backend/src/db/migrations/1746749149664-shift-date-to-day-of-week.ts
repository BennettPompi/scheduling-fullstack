import { MigrationInterface, QueryRunner } from "typeorm";

export class ShiftDateToDayOfWeek1746749149664 implements MigrationInterface {
    name = 'ShiftDateToDayOfWeek1746749149664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` CHANGE \`date\` \`dayOfWeek\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`dayOfWeek\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`dayOfWeek\` varchar(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`dayOfWeek\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`dayOfWeek\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shifts\` CHANGE \`dayOfWeek\` \`date\` date NOT NULL`);
    }

}
