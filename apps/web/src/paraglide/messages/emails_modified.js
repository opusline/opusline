/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_ModifiedInputs */

const en_emails_modified = /** @type {(inputs: Emails_ModifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`edited`)
};

const fr_emails_modified = /** @type {(inputs: Emails_ModifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`modifié`)
};

/**
* | output |
* | --- |
* | "edited" |
*
* @param {Emails_ModifiedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_modified = /** @type {((inputs?: Emails_ModifiedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_ModifiedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_modified(inputs)
	return en_emails_modified(inputs)
});