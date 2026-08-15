/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Fiscality_Vat_Zero_HintInputs */

const en_fiscality_vat_zero_hint = /** @type {(inputs: Fiscality_Vat_Zero_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set 0 if you do not charge VAT.`)
};

const fr_fiscality_vat_zero_hint = /** @type {(inputs: Fiscality_Vat_Zero_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mettez 0 si vous ne facturez pas de TVA.`)
};

/**
* | output |
* | --- |
* | "Set 0 if you do not charge VAT." |
*
* @param {Fiscality_Vat_Zero_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const fiscality_vat_zero_hint = /** @type {((inputs?: Fiscality_Vat_Zero_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fiscality_Vat_Zero_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_fiscality_vat_zero_hint(inputs)
	return en_fiscality_vat_zero_hint(inputs)
});