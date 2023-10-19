import * as express from "express";

import {
  CreateClientController,
  CreateClientRequest,
} from "./app/controllers/create-client-controller";

import { AddressInMemoryRepository } from "./infra/address-in-memory-repository";
import { AddressViaCEPRepository } from "./infra/address-via-cep-repository";
import { ClientMongoRepository } from "./infra/client-mongo-repository";
import { ExpressControllerAdapter } from "./infra/express-controller-adapter";
import { FindOneAddressByCEPRepositoryComposite } from "./infra/find-one-address-by-cep-repository-composite";
import { MongoHelper } from "./infra/mongo-helper";
import { YupValidationAdapter } from "./infra/yup-validation-adapter";

MongoHelper.getInstance()
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    const addressInMemoryRepository = new AddressInMemoryRepository();
    const addressViaCEPRepository = new AddressViaCEPRepository();

    const findOneAddressByCEPRepositoryComposite =
      new FindOneAddressByCEPRepositoryComposite([
        addressInMemoryRepository,
        addressViaCEPRepository,
      ]);

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
          findOneAddressByCEPRepository: findOneAddressByCEPRepositoryComposite,
          findOneClientByEmailRepository: clientMongoRepository,
          createClientRepository: clientMongoRepository,
        })
      )
    );

    app.listen(3000, "0.0.0.0");
  });
