/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_ResetInputs */

const en_emails_reset = /** @type {(inputs: Emails_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore the template`)
};

const fr_emails_reset = /** @type {(inputs: Emails_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rétablir le modèle`)
};

/**
* | output |
* | --- |
* | "Restore the template" |
*
* @param {Emails_ResetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_reset = /** @type {((inputs?: Emails_ResetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_ResetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_reset(inputs)
	return en_emails_reset(inputs)
});