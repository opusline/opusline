/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_CheckInputs */

const en_integrations_super_pdp_check = /** @type {(inputs: Integrations_Super_Pdp_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Test the connection`)
};

const fr_integrations_super_pdp_check = /** @type {(inputs: Integrations_Super_Pdp_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tester la connexion`)
};

/**
* | output |
* | --- |
* | "Test the connection" |
*
* @param {Integrations_Super_Pdp_CheckInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_check = /** @type {((inputs?: Integrations_Super_Pdp_CheckInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_CheckInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_check(inputs)
	return en_integrations_super_pdp_check(inputs)
});