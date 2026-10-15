/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_CreatingInputs */

const en_invoices_creating = /** @type {(inputs: Invoices_CreatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Creating…`)
};

const fr_invoices_creating = /** @type {(inputs: Invoices_CreatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Création…`)
};

/**
* | output |
* | --- |
* | "Creating…" |
*
* @param {Invoices_CreatingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_creating = /** @type {((inputs?: Invoices_CreatingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_CreatingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_creating(inputs)
	return en_invoices_creating(inputs)
});