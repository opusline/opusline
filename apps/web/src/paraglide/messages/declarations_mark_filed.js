/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Mark_FiledInputs */

const en_declarations_mark_filed = /** @type {(inputs: Declarations_Mark_FiledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as filed`)
};

const fr_declarations_mark_filed = /** @type {(inputs: Declarations_Mark_FiledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer déclarée`)
};

/**
* | output |
* | --- |
* | "Mark as filed" |
*
* @param {Declarations_Mark_FiledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_mark_filed = /** @type {((inputs?: Declarations_Mark_FiledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Mark_FiledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_mark_filed(inputs)
	return en_declarations_mark_filed(inputs)
});