/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_TitleInputs */

const en_paste_title = /** @type {(inputs: Paste_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill from a text`)
};

const fr_paste_title = /** @type {(inputs: Paste_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplir depuis un texte`)
};

/**
* | output |
* | --- |
* | "Fill from a text" |
*
* @param {Paste_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_title = /** @type {((inputs?: Paste_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_title(inputs)
	return en_paste_title(inputs)
});