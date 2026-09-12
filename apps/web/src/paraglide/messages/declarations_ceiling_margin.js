/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ margin: NonNullable<unknown> }} Declarations_Ceiling_MarginInputs */

const en_declarations_ceiling_margin = /** @type {(inputs: Declarations_Ceiling_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.margin} of headroom`)
};

const fr_declarations_ceiling_margin = /** @type {(inputs: Declarations_Ceiling_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.margin} de marge`)
};

/**
* | output |
* | --- |
* | "{margin} of headroom" |
*
* @param {Declarations_Ceiling_MarginInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ceiling_margin = /** @type {((inputs: Declarations_Ceiling_MarginInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ceiling_MarginInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ceiling_margin(inputs)
	return en_declarations_ceiling_margin(inputs)
});