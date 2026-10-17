/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Toggle_OpenInputs */

const en_paste_toggle_open = /** @type {(inputs: Paste_Toggle_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste a text`)
};

const fr_paste_toggle_open = /** @type {(inputs: Paste_Toggle_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coller un texte`)
};

/**
* | output |
* | --- |
* | "Paste a text" |
*
* @param {Paste_Toggle_OpenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_toggle_open = /** @type {((inputs?: Paste_Toggle_OpenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Toggle_OpenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_toggle_open(inputs)
	return en_paste_toggle_open(inputs)
});