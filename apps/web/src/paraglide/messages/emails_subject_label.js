/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Subject_LabelInputs */

const en_emails_subject_label = /** @type {(inputs: Emails_Subject_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subject`)
};

const fr_emails_subject_label = /** @type {(inputs: Emails_Subject_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Objet`)
};

/**
* | output |
* | --- |
* | "Subject" |
*
* @param {Emails_Subject_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_subject_label = /** @type {((inputs?: Emails_Subject_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Subject_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_subject_label(inputs)
	return en_emails_subject_label(inputs)
});