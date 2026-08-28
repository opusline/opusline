/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ period: NonNullable<unknown> }} Declarations_Vat_TitleInputs */

const en_declarations_vat_title = /** @type {(inputs: Declarations_Vat_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA · 3310-CA3 ${i?.period}`)
};

const fr_declarations_vat_title = /** @type {(inputs: Declarations_Vat_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA · 3310-CA3 ${i?.period}`)
};

/**
* | output |
* | --- |
* | "TVA · 3310-CA3 {period}" |
*
* @param {Declarations_Vat_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_vat_title = /** @type {((inputs: Declarations_Vat_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Vat_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_vat_title(inputs)
	return en_declarations_vat_title(inputs)
});