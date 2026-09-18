/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Liberating_Ends_TitleInputs */

const en_declarations_liberating_ends_title = /** @type {(inputs: Declarations_Liberating_Ends_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The versement libératoire ends on ${i?.date}`)
};

const fr_declarations_liberating_ends_title = /** @type {(inputs: Declarations_Liberating_Ends_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le versement libératoire prend fin le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "The versement libératoire ends on {date}" |
*
* @param {Declarations_Liberating_Ends_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_ends_title = /** @type {((inputs: Declarations_Liberating_Ends_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Ends_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_ends_title(inputs)
	return en_declarations_liberating_ends_title(inputs)
});