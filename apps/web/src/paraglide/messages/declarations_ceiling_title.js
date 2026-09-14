/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Declarations_Ceiling_TitleInputs */

const en_declarations_ceiling_title = /** @type {(inputs: Declarations_Ceiling_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.year} revenue to date`)
};

const fr_declarations_ceiling_title = /** @type {(inputs: Declarations_Ceiling_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CA cumulé ${i?.year}`)
};

/**
* | output |
* | --- |
* | "{year} revenue to date" |
*
* @param {Declarations_Ceiling_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ceiling_title = /** @type {((inputs: Declarations_Ceiling_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ceiling_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ceiling_title(inputs)
	return en_declarations_ceiling_title(inputs)
});