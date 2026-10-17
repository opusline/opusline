/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Save_FailedInputs */

const en_emails_save_failed = /** @type {(inputs: Emails_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The template could not be saved.`)
};

const fr_emails_save_failed = /** @type {(inputs: Emails_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le modèle n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The template could not be saved." |
*
* @param {Emails_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_save_failed = /** @type {((inputs?: Emails_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_save_failed(inputs)
	return en_emails_save_failed(inputs)
});