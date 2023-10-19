import * as express from "express";
import { ExpressControllerAdapter } from "./infra/express-controller-adapter";
import { CreateClientController } from "./app/controllers/create-client-controller";
import { AddressViaCEPRepository } from "./infra/address-via-cep-repository";
import { ClientInMemoryRepository } from "./infra/client-in-memory-repository";

const addressViaCEPRepository = new AddressViaCEPRepository();
const clientInMemoryRepository = new ClientInMemoryRepository();

const app = express();

app.use(express.json());

app.post(
  "/api/v1/clients",
  ExpressControllerAdapter.adapt(
    new CreateClientController({
      findOneAddressByCEPRepository: addressViaCEPRepository,
      findOneClientByEmailRepository: clientInMemoryRepository,
      createClientRepository: clientInMemoryRepository,
    })
  )
);

app.listen(3000, "0.0.0.0");
