import { faker } from "@faker-js/faker";
import { NurseEntity } from "../../nurse/nurse.entity";
import { QueryRunner } from "typeorm";

export const seed = async (queryRunner: QueryRunner) => {
    // Create 15 nurses
    for (let i = 0; i < 15; i++) {
        const nurse = new NurseEntity();
        nurse.name = `${faker.person.firstName()} ${faker.person.lastName()}`;
        await queryRunner.manager.save(nurse);
    }
};
