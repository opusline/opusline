/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_DocsInputs */

const en_integrations_super_pdp_docs = /** @type {(inputs: Integrations_Super_Pdp_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Setup guide`)
};

const fr_integrations_super_pdp_docs = /** @type {(inputs: Integrations_Super_Pdp_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guide de configuration`)
};

/**
* | output |
* | --- |
* | "Setup guide" |
*
* @param {Integrations_Super_Pdp_DocsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_docs = /** @type {((inputs?: Integrations_Super_Pdp_DocsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_DocsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_docs(inputs)
	return en_integrations_super_pdp_docs(inputs)
});