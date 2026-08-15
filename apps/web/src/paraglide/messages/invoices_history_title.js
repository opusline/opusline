/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_History_TitleInputs */

const en_invoices_history_title = /** @type {(inputs: Invoices_History_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`History`)
};

const fr_invoices_history_title = /** @type {(inputs: Invoices_History_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Historique`)
};

/**
* | output |
* | --- |
* | "History" |
*
* @param {Invoices_History_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_history_title = /** @type {((inputs?: Invoices_History_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_History_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_history_title(inputs)
	return en_invoices_history_title(inputs)
});