export default interface QueryInterface {
  sql: string;
  timeout?: number;
  values?: Array<string|number>;
}
