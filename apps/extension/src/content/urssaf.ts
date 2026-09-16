import { urssafAdapter } from "../adapters/urssaf";
import { browserEnvironment, runPortal } from "../lib/run-portal";

void runPortal(urssafAdapter, browserEnvironment());
