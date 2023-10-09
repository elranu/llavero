import { Entity, Table } from 'dynamodb-onetable';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import UserSchema from './user-schema';

export type User = Entity<typeof UserSchema.models.User>;
export type Network = Entity<typeof UserSchema.models.Networks>;
export type Keys = Entity<typeof UserSchema.models.Keys>;
export type UserKeys = { user: User, keys: Keys[] };
export type UserNetworks = { user: User, networks: Network[] };
import createLogger from "@/utils/logger";
const logger = createLogger("user-repository");

export class UserRepository {
    private readonly userTable: Table;
    private readonly userModel;
    private readonly keysModel;
    private readonly networkModel;

    constructor(tableName = "UserData") {
       try {
         const client = new DynamoDBClient({});
         this.userTable = new Table({ client, name: tableName, schema: UserSchema });
         this.userModel = this.userTable.getModel('User');
         this.keysModel = this.userTable.getModel('Keys');
         this.networkModel = this.userTable.getModel('Networks');
       } catch (error) {
        logger.error(error, "Error in UserRepository constructor");
        throw error;
       }
    }

    async getUser(username: string) {
        const user =  await this.userModel.get({ username });
        return user;
    }

    async createUser(user: User) {
        const newUser = await this.userModel.create(user);
        return newUser;
    }

    static async updateTable(tableName = "UserData") {
        try {
            const client = new DynamoDBClient({});
        const userTable = new Table({ client, name: tableName, schema: UserSchema });
        console.log("Updating table");
        logger.log("Updating table");

        await userTable.updateTable();
        console.log("Table updated");
        logger.log("Table updated");
        } catch (error) {
            logger.error(error, "Error in UserRepository updateTable");
            throw error;
        }
    }
}