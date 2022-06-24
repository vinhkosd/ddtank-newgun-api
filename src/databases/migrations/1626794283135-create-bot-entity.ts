import {MigrationInterface, QueryRunner} from "typeorm";

export class createBotEntity1626794283135 implements MigrationInterface {
    name = 'createBotEntity1626794283135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bots" ("id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_8b1b0180229dec2cbfdf5e776e4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bots"`);
    }

}
