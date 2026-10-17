/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Body_LabelInputs */

const en_emails_body_label = /** @type {(inputs: Emails_Body_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Text`)
};

const fr_emails_body_label = /** @type {(inputs: Emails_Body_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Texte`)
};

/**
* | output |
* | --- |
* | "Text" |
*
* @param {Emails_Body_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_body_label = /** @type {((inputs?: Emails_Body_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Body_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_body_label(inputs)
	return en_emails_body_label(inputs)
});