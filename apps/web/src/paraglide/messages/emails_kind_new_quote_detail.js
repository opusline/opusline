/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Kind_New_Quote_DetailInputs */

const en_emails_kind_new_quote_detail = /** @type {(inputs: Emails_Kind_New_Quote_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent with every new quote`)
};

const fr_emails_kind_new_quote_detail = /** @type {(inputs: Emails_Kind_New_Quote_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé avec chaque nouveau devis`)
};

/**
* | output |
* | --- |
* | "Sent with every new quote" |
*
* @param {Emails_Kind_New_Quote_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_kind_new_quote_detail = /** @type {((inputs?: Emails_Kind_New_Quote_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Kind_New_Quote_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_kind_new_quote_detail(inputs)
	return en_emails_kind_new_quote_detail(inputs)
});