/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_HintInputs */

const en_paste_hint = /** @type {(inputs: Paste_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For an exact fill, give this prompt to your AI (ChatGPT, Claude, Mistral…): it answers with tags Opusline reads without interpretation.`)
};

const fr_paste_hint = /** @type {(inputs: Paste_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pour un remplissage exact, donnez ce prompt à votre IA (ChatGPT, Claude, Mistral…) : elle répondra avec des balises que Opusline lit sans interprétation.`)
};

/**
* | output |
* | --- |
* | "For an exact fill, give this prompt to your AI (ChatGPT, Claude, Mistral…): it answers with tags Opusline reads without interpretation." |
*
* @param {Paste_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_hint = /** @type {((inputs?: Paste_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_hint(inputs)
	return en_paste_hint(inputs)
});