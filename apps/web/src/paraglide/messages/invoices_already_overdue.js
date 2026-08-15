/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Already_OverdueInputs */

const en_invoices_already_overdue = /** @type {(inputs: Invoices_Already_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`already overdue`)
};

const fr_invoices_already_overdue = /** @type {(inputs: Invoices_Already_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`déjà échus`)
};

/**
* | output |
* | --- |
* | "already overdue" |
*
* @param {Invoices_Already_OverdueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_already_overdue = /** @type {((inputs?: Invoices_Already_OverdueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Already_OverdueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_already_overdue(inputs)
	return en_invoices_already_overdue(inputs)
});