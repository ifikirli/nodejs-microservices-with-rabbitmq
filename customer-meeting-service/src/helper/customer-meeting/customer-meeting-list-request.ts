import PaginationOptions from "../pagnination-options";

export default class CustomerMeetingListRequest {

  title?: string;
  customerId!: number;
  paginationOptions!: PaginationOptions;
}