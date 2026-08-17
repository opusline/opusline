/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_NoneInputs */

const en_deadlines_none = /** @type {(inputs: Deadlines_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No deadline to show. Opusline computes these from the French regime on your account.`)
};

const fr_deadlines_none = /** @type {(inputs: Deadlines_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune échéance à afficher. Opusline les calcule à partir du régime français de votre compte.`)
};

/**
* | output |
* | --- |
* | "No deadline to show. Opusline computes these from the French regime on your account." |
*
* @param {Deadlines_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_none = /** @type {((inputs?: Deadlines_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_none(inputs)
	return en_deadlines_none(inputs)
});