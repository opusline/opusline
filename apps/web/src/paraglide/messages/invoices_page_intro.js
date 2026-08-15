/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Page_IntroInputs */

const en_invoices_page_intro = /** @type {(inputs: Invoices_Page_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices are edited elsewhere. Opusline keeps track of what is invoiced, what remains to invoice and what has been collected.`)
};

const fr_invoices_page_intro = /** @type {(inputs: Invoices_Page_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les factures sont éditées ailleurs. Opusline garde la trace de ce qui est facturé, de ce qui reste à facturer et de ce qui est encaissé.`)
};

/**
* | output |
* | --- |
* | "Invoices are edited elsewhere. Opusline keeps track of what is invoiced, what remains to invoice and what has been collected." |
*
* @param {Invoices_Page_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_page_intro = /** @type {((inputs?: Invoices_Page_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Page_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_page_intro(inputs)
	return en_invoices_page_intro(inputs)
});