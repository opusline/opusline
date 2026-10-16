/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Super_Pdp_TitleInputs */

const en_integrations_super_pdp_title = /** @type {(inputs: Integrations_Super_Pdp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-invoicing`)
};

const fr_integrations_super_pdp_title = /** @type {(inputs: Integrations_Super_Pdp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture électronique`)
};

/**
* | output |
* | --- |
* | "E-invoicing" |
*
* @param {Integrations_Super_Pdp_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_title = /** @type {((inputs?: Integrations_Super_Pdp_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_title(inputs)
	return en_integrations_super_pdp_title(inputs)
});