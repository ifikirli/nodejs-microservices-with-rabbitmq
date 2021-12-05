/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Knex from "knex";

declare module "knex" {
    interface QueryBuilder {
    customSelect<TRecord, TResult>(value: number): QueryBuilder<TRecord, TResult>;
  }
}