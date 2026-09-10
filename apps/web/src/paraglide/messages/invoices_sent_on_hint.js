/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Sent_On_HintInputs */

const en_invoices_sent_on_hint = /** @type {(inputs: Invoices_Sent_On_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The day the document left. Reminders and the history are counted from it.`)
};

const fr_invoices_sent_on_hint = /** @type {(inputs: Invoices_Sent_On_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le jour où le document est parti. Les relances et l'historique s'y rattachent.`)
};

/**
* | output |
* | --- |
* | "The day the document left. Reminders and the history are counted from it." |
*
* @param {Invoices_Sent_On_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_sent_on_hint = /** @type {((inputs?: Invoices_Sent_On_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Sent_On_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_sent_on_hint(inputs)
	return en_invoices_sent_on_hint(inputs)
});