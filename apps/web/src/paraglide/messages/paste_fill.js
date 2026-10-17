/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_FillInputs */

const en_paste_fill = /** @type {(inputs: Paste_FillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill the document`)
};

const fr_paste_fill = /** @type {(inputs: Paste_FillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplir le document`)
};

/**
* | output |
* | --- |
* | "Fill the document" |
*
* @param {Paste_FillInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_fill = /** @type {((inputs?: Paste_FillInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_FillInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_fill(inputs)
	return en_paste_fill(inputs)
});