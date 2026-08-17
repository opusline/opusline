/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_NoneInputs */

const en_declarations_none = /** @type {(inputs: Declarations_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No return to file. Opusline computes these from the French regime on your account.`)
};

const fr_declarations_none = /** @type {(inputs: Declarations_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune déclaration à déposer. Opusline les calcule à partir du régime français de votre compte.`)
};

/**
* | output |
* | --- |
* | "No return to file. Opusline computes these from the French regime on your account." |
*
* @param {Declarations_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_none = /** @type {((inputs?: Declarations_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_none(inputs)
	return en_declarations_none(inputs)
});