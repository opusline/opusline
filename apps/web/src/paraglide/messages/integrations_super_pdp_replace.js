/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_ReplaceInputs */

const en_integrations_super_pdp_replace = /** @type {(inputs: Integrations_Super_Pdp_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace`)
};

const fr_integrations_super_pdp_replace = /** @type {(inputs: Integrations_Super_Pdp_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplacer`)
};

/**
* | output |
* | --- |
* | "Replace" |
*
* @param {Integrations_Super_Pdp_ReplaceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_replace = /** @type {((inputs?: Integrations_Super_Pdp_ReplaceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_ReplaceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_replace(inputs)
	return en_integrations_super_pdp_replace(inputs)
});