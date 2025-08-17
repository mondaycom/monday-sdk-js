import { ClientData } from "./client-data.interface";
import { ClientExecute } from "./client-execute.interface";
import { ClientApi } from "./client-api.interface";
import { SemanticAPI } from "./api";

export type MondayClientSdk = ClientData & ClientExecute & ClientApi & SemanticAPI;
