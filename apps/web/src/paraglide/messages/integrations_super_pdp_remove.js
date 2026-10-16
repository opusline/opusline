/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_RemoveInputs */

const en_integrations_super_pdp_remove = /** @type {(inputs: Integrations_Super_Pdp_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

const fr_integrations_super_pdp_remove = /** @type {(inputs: Integrations_Super_Pdp_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer`)
};

/**
* | output |
* | --- |
* | "Remove" |
*
* @param {Integrations_Super_Pdp_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_remove = /** @type {((inputs?: Integrations_Super_Pdp_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_remove(inputs)
	return en_integrations_super_pdp_remove(inputs)
});