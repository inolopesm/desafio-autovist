import type { RequestHandler } from "express";
import type { Controller, Request } from "../app/protocols/controller";

export class ExpressControllerAdapter {
  static adapt(controller: Controller): RequestHandler {
    return async (req, res, next) => {
      const request: Request = {
        params: req.params,
        body: req.body,
        query: Object.entries(req.query).reduce<Record<string, string>>(
          (o, [k, v]) => (typeof v === "string" ? { ...o, [k]: v } : o),
          {}
        ),
      };

      try {
        const response = await controller.handle(request);
        res.status(response.statusCode);
        response.body !== undefined && res.send(response.body);
      } catch (error) {
        next(error);
      }
    };
  }
}
