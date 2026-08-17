/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Note_PlaceholderInputs */

const en_treasury_note_placeholder = /** @type {(inputs: Treasury_Note_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`August pay`)
};

const fr_treasury_note_placeholder = /** @type {(inputs: Treasury_Note_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Salaire août`)
};

/**
* | output |
* | --- |
* | "August pay" |
*
* @param {Treasury_Note_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_note_placeholder = /** @type {((inputs?: Treasury_Note_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Note_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_note_placeholder(inputs)
	return en_treasury_note_placeholder(inputs)
});