import KnexDB from "../db/knex";
import { DatabaseException } from "../exception/custom.exception";

export default abstract class BaseRepository<T> {
  
  table: string;
  knex: typeof KnexDB;

  constructor (table: string) {
    
      this.table = table;
      this.knex = KnexDB;
  }

  async add (item: T): Promise<number> {
      
      return new Promise((resolve, reject) => {

          this.knex.db(this.table).insert(item).returning("id")
              .then(function (ids: number[]) {
                  resolve(ids[0]);
              })
              .catch((error : Error) => {
                  reject(new DatabaseException(error));
              });
      });
  }

  async findById (id: number): Promise<T> {
      
      return new Promise((resolve, reject) => {

          this.knex.db(this.table)
              .select()
              .where("id", id)
              .first()
              .then((detail: T) => {
                  resolve(detail);
              })
              .catch((error: Error) => {
                  reject(new DatabaseException(error));
              });
      });
  }
  
  async update (id: number, item: T): Promise<boolean> {
      
      return new Promise((resolve, reject) => {

          this.knex.db(this.table)
              .where("id", id)
              .update(item)
              .then(() => {
                  resolve(true);
              })
              .catch((error : Error) => {
                  reject(new DatabaseException(error));
              });
      });
  }

  async delete (id: number): Promise<boolean> {
      
      return new Promise((resolve, reject) => {

          this.knex.db(this.table)
              .where("id", id)
              .delete()
              .then(() => {
                  resolve(true);
              })
              .catch((error : Error) => {
                  reject(new DatabaseException(error));
              });
      });
  }
}