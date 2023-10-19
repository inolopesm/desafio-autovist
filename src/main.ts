import * as express from "express";

import {
  CreateClientController,
  CreateClientRequest,
} from "./app/controllers/create-client-controller";

import {
  FindClientsController,
  FindClientsRequest,
} from "./app/controllers/find-clients-controller";

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
              .matches(/^\d{11}$/),
            cep: yup
              .string()
              .defined()
              .matches(/^\d{8}$/),
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
            limit: yup.string().matches(/^\d+$/),
            offset: yup.string().matches(/^\d+$/),
          }),
          body: yup.object(),
        })
      ),
      findClientsRepository: clientMongoRepository,
    })
  )
);

MongoHelper.getInstance()
  .connect(process.env.MONGO_URL as string)
  .then(() => app.listen(3000, "0.0.0.0"));
