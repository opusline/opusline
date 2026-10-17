/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_TitleInputs */

const en_emails_title = /** @type {(inputs: Emails_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-mails`)
};

const fr_emails_title = /** @type {(inputs: Emails_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-mails`)
};

/**
* | output |
* | --- |
* | "E-mails" |
*
* @param {Emails_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_title = /** @type {((inputs?: Emails_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_title(inputs)
	return en_emails_title(inputs)
});