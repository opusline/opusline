/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Reopen_SentInputs */

const en_invoices_reopen_sent = /** @type {(inputs: Invoices_Reopen_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not collected after all`)
};

const fr_invoices_reopen_sent = /** @type {(inputs: Invoices_Reopen_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encaissée finalement`)
};

/**
* | output |
* | --- |
* | "Not collected after all" |
*
* @param {Invoices_Reopen_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_reopen_sent = /** @type {((inputs?: Invoices_Reopen_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Reopen_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_reopen_sent(inputs)
	return en_invoices_reopen_sent(inputs)
});