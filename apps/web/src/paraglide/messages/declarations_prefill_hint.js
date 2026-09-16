/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Prefill_HintInputs */

const en_declarations_prefill_hint = /** @type {(inputs: Declarations_Prefill_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requires the Opusline browser extension.`)
};

const fr_declarations_prefill_hint = /** @type {(inputs: Declarations_Prefill_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nécessite l’extension navigateur Opusline.`)
};

/**
* | output |
* | --- |
* | "Requires the Opusline browser extension." |
*
* @param {Declarations_Prefill_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_prefill_hint = /** @type {((inputs?: Declarations_Prefill_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Prefill_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_prefill_hint(inputs)
	return en_declarations_prefill_hint(inputs)
});