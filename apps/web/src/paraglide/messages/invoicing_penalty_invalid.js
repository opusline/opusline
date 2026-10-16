/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Penalty_InvalidInputs */

const en_invoicing_penalty_invalid = /** @type {(inputs: Invoicing_Penalty_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a rate between 0 and 100, or leave it empty for the ECB rate plus 10 points.`)
};

const fr_invoicing_penalty_invalid = /** @type {(inputs: Invoicing_Penalty_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez un taux entre 0 et 100, ou laissez vide pour appliquer le taux BCE + 10 points.`)
};

/**
* | output |
* | --- |
* | "Enter a rate between 0 and 100, or leave it empty for the ECB rate plus 10 points." |
*
* @param {Invoicing_Penalty_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_invalid = /** @type {((inputs?: Invoicing_Penalty_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_invalid(inputs)
	return en_invoicing_penalty_invalid(inputs)
});