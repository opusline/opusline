/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Invoices_DescInputs */

const en_deadlines_feed_invoices_desc = /** @type {(inputs: Deadlines_Feed_Invoices_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One entry per open invoice, on its due date. Disappears as soon as it is collected.`)
};

const fr_deadlines_feed_invoices_desc = /** @type {(inputs: Deadlines_Feed_Invoices_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une entrée par facture ouverte, à sa date d'échéance. Disparaît dès qu'elle est encaissée.`)
};

/**
* | output |
* | --- |
* | "One entry per open invoice, on its due date. Disappears as soon as it is collected." |
*
* @param {Deadlines_Feed_Invoices_DescInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_invoices_desc = /** @type {((inputs?: Deadlines_Feed_Invoices_DescInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Invoices_DescInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_invoices_desc(inputs)
	return en_deadlines_feed_invoices_desc(inputs)
});