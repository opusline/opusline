/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Platform_Inbox_FailedInputs */

const en_expenses_platform_inbox_failed = /** @type {(inputs: Expenses_Platform_Inbox_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The platform's inbox could not be read.`)
};

const fr_expenses_platform_inbox_failed = /** @type {(inputs: Expenses_Platform_Inbox_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La boîte de réception de la plateforme n'a pas pu être lue.`)
};

/**
* | output |
* | --- |
* | "The platform's inbox could not be read." |
*
* @param {Expenses_Platform_Inbox_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_failed = /** @type {((inputs?: Expenses_Platform_Inbox_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_failed(inputs)
	return en_expenses_platform_inbox_failed(inputs)
});