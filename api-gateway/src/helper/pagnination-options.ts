import { SortTypes } from "../enum/sort-types";

export default class PaginationOptions {

  skip!: number;
  limit!: number;
  order_by!: string;
  sort_by!: SortTypes;
}