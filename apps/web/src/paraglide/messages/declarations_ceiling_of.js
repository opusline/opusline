/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ ceiling: NonNullable<unknown> }} Declarations_Ceiling_OfInputs */

const en_declarations_ceiling_of = /** @type {(inputs: Declarations_Ceiling_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of ${i?.ceiling}`)
};

const fr_declarations_ceiling_of = /** @type {(inputs: Declarations_Ceiling_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sur ${i?.ceiling}`)
};

/**
* | output |
* | --- |
* | "of {ceiling}" |
*
* @param {Declarations_Ceiling_OfInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ceiling_of = /** @type {((inputs: Declarations_Ceiling_OfInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ceiling_OfInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ceiling_of(inputs)
	return en_declarations_ceiling_of(inputs)
});