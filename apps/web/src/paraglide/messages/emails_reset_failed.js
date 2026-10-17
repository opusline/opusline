/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Reset_FailedInputs */

const en_emails_reset_failed = /** @type {(inputs: Emails_Reset_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The template could not be restored.`)
};

const fr_emails_reset_failed = /** @type {(inputs: Emails_Reset_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le modèle n'a pas pu être rétabli.`)
};

/**
* | output |
* | --- |
* | "The template could not be restored." |
*
* @param {Emails_Reset_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_reset_failed = /** @type {((inputs?: Emails_Reset_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Reset_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_reset_failed(inputs)
	return en_emails_reset_failed(inputs)
});