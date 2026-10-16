/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_Environment_ProductionInputs */

const en_integrations_super_pdp_environment_production = /** @type {(inputs: Integrations_Super_Pdp_Environment_ProductionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Production`)
};

const fr_integrations_super_pdp_environment_production = /** @type {(inputs: Integrations_Super_Pdp_Environment_ProductionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Production`)
};

/**
* | output |
* | --- |
* | "Production" |
*
* @param {Integrations_Super_Pdp_Environment_ProductionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_environment_production = /** @type {((inputs?: Integrations_Super_Pdp_Environment_ProductionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Environment_ProductionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_environment_production(inputs)
	return en_integrations_super_pdp_environment_production(inputs)
});