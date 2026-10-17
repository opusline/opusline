/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_SavedInputs */

const en_emails_saved = /** @type {(inputs: Emails_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Template saved`)
};

const fr_emails_saved = /** @type {(inputs: Emails_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modèle enregistré`)
};

/**
* | output |
* | --- |
* | "Template saved" |
*
* @param {Emails_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_saved = /** @type {((inputs?: Emails_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_saved(inputs)
	return en_emails_saved(inputs)
});