/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ kind: NonNullable<unknown>, period: NonNullable<unknown> }} Declarations_Marked_FiledInputs */

const en_declarations_marked_filed = /** @type {(inputs: Declarations_Marked_FiledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} ${i?.period} marked as filed`)
};

const fr_declarations_marked_filed = /** @type {(inputs: Declarations_Marked_FiledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} ${i?.period} marquée déclarée`)
};

/**
* | output |
* | --- |
* | "{kind} {period} marked as filed" |
*
* @param {Declarations_Marked_FiledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_marked_filed = /** @type {((inputs: Declarations_Marked_FiledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Marked_FiledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_marked_filed(inputs)
	return en_declarations_marked_filed(inputs)
});