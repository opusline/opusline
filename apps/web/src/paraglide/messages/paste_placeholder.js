/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_PlaceholderInputs */

const en_paste_placeholder = /** @type {(inputs: Paste_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste your AI's answer here`)
};

const fr_paste_placeholder = /** @type {(inputs: Paste_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collez ici la réponse de votre IA`)
};

/**
* | output |
* | --- |
* | "Paste your AI's answer here" |
*
* @param {Paste_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_placeholder = /** @type {((inputs?: Paste_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_placeholder(inputs)
	return en_paste_placeholder(inputs)
});