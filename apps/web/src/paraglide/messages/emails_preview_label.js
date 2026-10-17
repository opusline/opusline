/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Preview_LabelInputs */

const en_emails_preview_label = /** @type {(inputs: Emails_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preview · with sample figures`)
};

const fr_emails_preview_label = /** @type {(inputs: Emails_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu · avec des chiffres d'exemple`)
};

/**
* | output |
* | --- |
* | "Preview · with sample figures" |
*
* @param {Emails_Preview_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_preview_label = /** @type {((inputs?: Emails_Preview_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Preview_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_preview_label(inputs)
	return en_emails_preview_label(inputs)
});