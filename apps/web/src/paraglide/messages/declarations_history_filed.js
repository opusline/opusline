/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_FiledInputs */

const en_declarations_history_filed = /** @type {(inputs: Declarations_History_FiledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filed`)
};

const fr_declarations_history_filed = /** @type {(inputs: Declarations_History_FiledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déclarée`)
};

/**
* | output |
* | --- |
* | "Filed" |
*
* @param {Declarations_History_FiledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_filed = /** @type {((inputs?: Declarations_History_FiledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_FiledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_filed(inputs)
	return en_declarations_history_filed(inputs)
});