/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Correct_Dates_HintInputs */

const en_invoices_correct_dates_hint = /** @type {(inputs: Invoices_Correct_Dates_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moving a collection date from one month to the next moves the revenue with it.`)
};

const fr_invoices_correct_dates_hint = /** @type {(inputs: Invoices_Correct_Dates_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déplacer une date d'encaissement d'un mois à l'autre déplace la recette avec elle.`)
};

/**
* | output |
* | --- |
* | "Moving a collection date from one month to the next moves the revenue with it." |
*
* @param {Invoices_Correct_Dates_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_correct_dates_hint = /** @type {((inputs?: Invoices_Correct_Dates_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Correct_Dates_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_correct_dates_hint(inputs)
	return en_invoices_correct_dates_hint(inputs)
});