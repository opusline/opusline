/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Environment_SandboxInputs */

const en_integrations_super_pdp_environment_sandbox = /** @type {(inputs: Integrations_Super_Pdp_Environment_SandboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sandbox`)
};

const fr_integrations_super_pdp_environment_sandbox = /** @type {(inputs: Integrations_Super_Pdp_Environment_SandboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bac à sable`)
};

/**
* | output |
* | --- |
* | "Sandbox" |
*
* @param {Integrations_Super_Pdp_Environment_SandboxInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_environment_sandbox = /** @type {((inputs?: Integrations_Super_Pdp_Environment_SandboxInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Environment_SandboxInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_environment_sandbox(inputs)
	return en_integrations_super_pdp_environment_sandbox(inputs)
});