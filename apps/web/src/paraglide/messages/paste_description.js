/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_DescriptionInputs */

const en_paste_description = /** @type {(inputs: Paste_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste the answer your AI gave to the prompt below: Opusline reads the client, the lines and the terms from its tags.`)
};

const fr_paste_description = /** @type {(inputs: Paste_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collez la réponse de votre IA au prompt ci-dessous : Opusline en tire le client, les lignes et les conditions.`)
};

/**
* | output |
* | --- |
* | "Paste the answer your AI gave to the prompt below: Opusline reads the client, the lines and the terms from its tags." |
*
* @param {Paste_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_description = /** @type {((inputs?: Paste_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_description(inputs)
	return en_paste_description(inputs)
});