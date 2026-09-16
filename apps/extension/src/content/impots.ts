import { impotsAdapter } from "../adapters/impots";
import { browserEnvironment, runPortal } from "../lib/run-portal";

void runPortal(impotsAdapter, browserEnvironment());
