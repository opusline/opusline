/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Insert_LabelInputs */

const en_emails_insert_label = /** @type {(inputs: Emails_Insert_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insert:`)
};

const fr_emails_insert_label = /** @type {(inputs: Emails_Insert_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insérer :`)
};

/**
* | output |
* | --- |
* | "Insert:" |
*
* @param {Emails_Insert_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_insert_label = /** @type {((inputs?: Emails_Insert_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Insert_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_insert_label(inputs)
	return en_emails_insert_label(inputs)
});