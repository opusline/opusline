/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_IntroInputs */

const en_external_quote_intro = /** @type {(inputs: External_Quote_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline follows its answer and what is invoiced from it. The document stays your tool's.`)
};

const fr_external_quote_intro = /** @type {(inputs: External_Quote_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline en suit la réponse et ce qui en est facturé. Le document reste celui de votre outil.`)
};

/**
* | output |
* | --- |
* | "Opusline follows its answer and what is invoiced from it. The document stays your tool's." |
*
* @param {External_Quote_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_intro = /** @type {((inputs?: External_Quote_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_intro(inputs)
	return en_external_quote_intro(inputs)
});