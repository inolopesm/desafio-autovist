export interface Request<
  TParams extends Record<string, string | undefined> = {},
  TQuery extends Record<string, string | undefined> = {},
  TBody = unknown
> {
  params: TParams;
  query: TQuery;
  body: TBody;
}

export interface Response {
  statusCode: number;
  body?: unknown;
}

export interface Controller {
  handle(request: Request): Promise<Response>;
}
