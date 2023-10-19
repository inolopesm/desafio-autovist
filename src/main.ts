import * as express from "express";
import { ExpressControllerAdapter } from "./infra/express-controller-adapter";
import {
  CreateClientController,
  CreateClientRequest,
} from "./app/controllers/create-client-controller";
import { AddressViaCEPRepository } from "./infra/address-via-cep-repository";
import { ClientInMemoryRepository } from "./infra/client-in-memory-repository";
import { YupValidationAdapter } from "./infra/yup-validation-adapter";

const addressViaCEPRepository = new AddressViaCEPRepository();
const clientInMemoryRepository = new ClientInMemoryRepository();

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
      findOneAddressByCEPRepository: addressViaCEPRepository,
      findOneClientByEmailRepository: clientInMemoryRepository,
      createClientRepository: clientInMemoryRepository,
    })
  )
);

app.listen(3000, "0.0.0.0");
