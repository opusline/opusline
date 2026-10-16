/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_ExitInputs */

const en_invoicing_exit = /** @type {(inputs: Invoicing_ExitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to Opusline`)
};

const fr_invoicing_exit = /** @type {(inputs: Invoicing_ExitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour à Opusline`)
};

/**
* | output |
* | --- |
* | "Back to Opusline" |
*
* @param {Invoicing_ExitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_exit = /** @type {((inputs?: Invoicing_ExitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_ExitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_exit(inputs)
	return en_invoicing_exit(inputs)
});