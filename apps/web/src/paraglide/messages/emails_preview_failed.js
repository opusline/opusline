/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Preview_FailedInputs */

const en_emails_preview_failed = /** @type {(inputs: Emails_Preview_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The preview could not be rendered.`)
};

const fr_emails_preview_failed = /** @type {(inputs: Emails_Preview_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'aperçu n'a pas pu être rendu.`)
};

/**
* | output |
* | --- |
* | "The preview could not be rendered." |
*
* @param {Emails_Preview_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_preview_failed = /** @type {((inputs?: Emails_Preview_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Preview_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_preview_failed(inputs)
	return en_emails_preview_failed(inputs)
});