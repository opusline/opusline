/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Fiscality_Vat_NameInputs */

const en_fiscality_vat_name = /** @type {(inputs: Fiscality_Vat_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT`)
};

const fr_fiscality_vat_name = /** @type {(inputs: Fiscality_Vat_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

/**
* | output |
* | --- |
* | "VAT" |
*
* @param {Fiscality_Vat_NameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const fiscality_vat_name = /** @type {((inputs?: Fiscality_Vat_NameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fiscality_Vat_NameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_fiscality_vat_name(inputs)
	return en_fiscality_vat_name(inputs)
});