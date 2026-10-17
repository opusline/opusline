/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_UnsavedInputs */

const en_emails_unsaved = /** @type {(inputs: Emails_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unsaved changes`)
};

const fr_emails_unsaved = /** @type {(inputs: Emails_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifications non enregistrées`)
};

/**
* | output |
* | --- |
* | "Unsaved changes" |
*
* @param {Emails_UnsavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_unsaved = /** @type {((inputs?: Emails_UnsavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_UnsavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_unsaved(inputs)
	return en_emails_unsaved(inputs)
});