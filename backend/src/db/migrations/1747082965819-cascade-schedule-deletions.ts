import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeScheduleDeletions1747082965819 implements MigrationInterface {
    name = 'CascadeScheduleDeletions1747082965819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_99de60c4b123a0bc1b2126c530b\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_99de60c4b123a0bc1b2126c530b\` FOREIGN KEY (\`scheduleId\`) REFERENCES \`schedules\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_99de60c4b123a0bc1b2126c530b\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_99de60c4b123a0bc1b2126c530b\` FOREIGN KEY (\`scheduleId\`) REFERENCES \`schedules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
