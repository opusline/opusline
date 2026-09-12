/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Ceiling_OverInputs */

const en_declarations_ceiling_over = /** @type {(inputs: Declarations_Ceiling_OverInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ceiling exceeded by ${i?.amount}`)
};

const fr_declarations_ceiling_over = /** @type {(inputs: Declarations_Ceiling_OverInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`plafond dépassé de ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "ceiling exceeded by {amount}" |
*
* @param {Declarations_Ceiling_OverInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ceiling_over = /** @type {((inputs: Declarations_Ceiling_OverInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ceiling_OverInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ceiling_over(inputs)
	return en_declarations_ceiling_over(inputs)
});