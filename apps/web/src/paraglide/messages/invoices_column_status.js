/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Column_StatusInputs */

const en_invoices_column_status = /** @type {(inputs: Invoices_Column_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

const fr_invoices_column_status = /** @type {(inputs: Invoices_Column_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Statut`)
};

/**
* | output |
* | --- |
* | "Status" |
*
* @param {Invoices_Column_StatusInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_column_status = /** @type {((inputs?: Invoices_Column_StatusInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Column_StatusInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_column_status(inputs)
	return en_invoices_column_status(inputs)
});