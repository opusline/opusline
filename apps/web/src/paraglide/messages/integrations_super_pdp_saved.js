/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_SavedInputs */

const en_integrations_super_pdp_saved = /** @type {(inputs: Integrations_Super_Pdp_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP connected.`)
};

const fr_integrations_super_pdp_saved = /** @type {(inputs: Integrations_Super_Pdp_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP connecté.`)
};

/**
* | output |
* | --- |
* | "Super PDP connected." |
*
* @param {Integrations_Super_Pdp_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_saved = /** @type {((inputs?: Integrations_Super_Pdp_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_saved(inputs)
	return en_integrations_super_pdp_saved(inputs)
});