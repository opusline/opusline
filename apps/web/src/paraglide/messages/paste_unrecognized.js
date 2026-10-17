/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_UnrecognizedInputs */

const en_paste_unrecognized = /** @type {(inputs: Paste_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This text is not in the expected format. Copy the prompt, give it to your AI and paste its answer here.`)
};

const fr_paste_unrecognized = /** @type {(inputs: Paste_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce texte n'est pas dans le format attendu. Copiez le prompt, donnez-le à votre IA et collez sa réponse ici.`)
};

/**
* | output |
* | --- |
* | "This text is not in the expected format. Copy the prompt, give it to your AI and paste its answer here." |
*
* @param {Paste_UnrecognizedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_unrecognized = /** @type {((inputs?: Paste_UnrecognizedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_UnrecognizedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_unrecognized(inputs)
	return en_paste_unrecognized(inputs)
});