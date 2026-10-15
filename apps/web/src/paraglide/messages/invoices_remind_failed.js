/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Remind_FailedInputs */

const en_invoices_remind_failed = /** @type {(inputs: Invoices_Remind_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The reminder could not be recorded.`)
};

const fr_invoices_remind_failed = /** @type {(inputs: Invoices_Remind_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La relance n'a pas pu être notée.`)
};

/**
* | output |
* | --- |
* | "The reminder could not be recorded." |
*
* @param {Invoices_Remind_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_remind_failed = /** @type {((inputs?: Invoices_Remind_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Remind_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_remind_failed(inputs)
	return en_invoices_remind_failed(inputs)
});