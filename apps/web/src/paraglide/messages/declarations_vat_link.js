/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Vat_LinkInputs */

const en_declarations_vat_link = /** @type {(inputs: Declarations_Vat_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open impots.gouv.fr →`)
};

const fr_declarations_vat_link = /** @type {(inputs: Declarations_Vat_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir impots.gouv.fr →`)
};

/**
* | output |
* | --- |
* | "Open impots.gouv.fr →" |
*
* @param {Declarations_Vat_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_vat_link = /** @type {((inputs?: Declarations_Vat_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Vat_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_vat_link(inputs)
	return en_declarations_vat_link(inputs)
});