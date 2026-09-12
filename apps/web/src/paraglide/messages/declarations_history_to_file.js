/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_To_FileInputs */

const en_declarations_history_to_file = /** @type {(inputs: Declarations_History_To_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`to file`)
};

const fr_declarations_history_to_file = /** @type {(inputs: Declarations_History_To_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`à déclarer`)
};

/**
* | output |
* | --- |
* | "to file" |
*
* @param {Declarations_History_To_FileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_to_file = /** @type {((inputs?: Declarations_History_To_FileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_To_FileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_to_file(inputs)
	return en_declarations_history_to_file(inputs)
});