import type { Server } from "node:http";
import * as express from "express";

import {
  CreateClientController,
  CreateClientRequest,
} from "./app/controllers/create-client-controller";

import {
  FindClientsController,
  FindClientsRequest,
} from "./app/controllers/find-clients-controller";

import {
  FindOneClientController,
  FindOneClientRequest,
} from "./app/controllers/find-one-client-controller";

import {
  RemoveClientController,
  RemoveClientRequest,
} from "./app/controllers/remove-client-controller";

import { AddressViaCEPRepository } from "./infra/address-via-cep-repository";
import { ClientMongoRepository } from "./infra/client-mongo-repository";
import { ExpressControllerAdapter } from "./infra/express-controller-adapter";
import { InMemoryCache } from "./infra/in-memory-cache";
import { MongoHelper } from "./infra/mongo-helper";
import { YupValidationAdapter } from "./infra/yup-validation-adapter";

const { MONGO_URL } = process.env;

if (MONGO_URL === undefined) {
  throw new Error("MONGO_URL is a required environment variable");
}

const inMemoryCache = new InMemoryCache();
const addressViaCEPRepository = new AddressViaCEPRepository();
const clientMongoRepository = new ClientMongoRepository();

const app = express();

app.use(express.json());

app.post(
  "/api/v1/clients",
  ExpressControllerAdapter.adapt(
    new CreateClientController({
      validation: new YupValidationAdapter<CreateClientRequest>((yup) =>
        yup.object({
          params: yup.object(),
          query: yup.object(),
          body: yup.object({
            name: yup.string().defined().min(1).max(255),
            email: yup.string().defined().min(1).max(255).email(),
            phone: yup
              .string()
              .defined()
              .matches(/^\d{11}$/, "${path} must be exactly 11 numbers"),
            cep: yup
              .string()
              .defined()
              .matches(/^\d{8}$/, "${path} must be exactly 8 numbers"),
          }),
        })
      ),
      cache: inMemoryCache,
      findOneAddressByCEPRepository: addressViaCEPRepository,
      findOneClientByEmailRepository: clientMongoRepository,
      createClientRepository: clientMongoRepository,
    })
  )
);

app.get(
  "/api/v1/clients",
  ExpressControllerAdapter.adapt(
    new FindClientsController({
      validation: new YupValidationAdapter<FindClientsRequest>((yup) =>
        yup.object({
          params: yup.object(),
          query: yup.object({
            limit: yup
              .string()
              .matches(/^\d+$/, "${path} must contain only numbers"),
            offset: yup
              .string()
              .matches(/^\d+$/, "${path} must contain only numbers"),
            name: yup.string().max(255),
          }),
          body: yup.object(),
        })
      ),
      findClientsRepository: clientMongoRepository,
      findClientsLikeNameRepository: clientMongoRepository,
    })
  )
);

app.get(
  "/api/v1/clients/:clientId",
  ExpressControllerAdapter.adapt(
    new FindOneClientController({
      validation: new YupValidationAdapter<FindOneClientRequest>((yup) =>
        yup.object({
          params: yup.object({ clientId: yup.string().defined().uuid() }),
          query: yup.object(),
          body: yup.object(),
        })
      ),
      findOneClientByIdRepository: clientMongoRepository,
    })
  )
);

app.delete(
  "/api/v1/clients/:clientId",
  ExpressControllerAdapter.adapt(
    new RemoveClientController({
      validation: new YupValidationAdapter<RemoveClientRequest>((yup) =>
        yup.object({
          params: yup.object({ clientId: yup.string().defined().uuid() }),
          query: yup.object(),
          body: yup.object(),
        })
      ),
      findOneClientByIdRepository: clientMongoRepository,
      removeClientByIdRepository: clientMongoRepository,
    })
  )
);

let server: Server;

MongoHelper.getInstance()
  .connect(MONGO_URL)
  .then(() => (server = app.listen(3000, "0.0.0.0")));

for (const event of ["SIGINT", "SIGTERM"] as const) {
  process.on(event, () => {
    server.close((err) => {
      if (err) throw err;

      MongoHelper.getInstance()
        .disconnect()
        .then(() => process.exit(0));
    });
  });
}
