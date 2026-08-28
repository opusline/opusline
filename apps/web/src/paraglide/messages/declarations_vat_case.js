/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ box: NonNullable<unknown> }} Declarations_Vat_CaseInputs */

const en_declarations_vat_case = /** @type {(inputs: Declarations_Vat_CaseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`case ${i?.box}`)
};

const fr_declarations_vat_case = /** @type {(inputs: Declarations_Vat_CaseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`case ${i?.box}`)
};

/**
* | output |
* | --- |
* | "case {box}" |
*
* @param {Declarations_Vat_CaseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_vat_case = /** @type {((inputs: Declarations_Vat_CaseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Vat_CaseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_vat_case(inputs)
	return en_declarations_vat_case(inputs)
});