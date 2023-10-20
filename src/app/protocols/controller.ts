export interface Request<TParams = unknown, TQuery = unknown, TBody = unknown> {
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
