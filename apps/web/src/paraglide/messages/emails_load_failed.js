/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Load_FailedInputs */

const en_emails_load_failed = /** @type {(inputs: Emails_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The e-mail templates could not be loaded.`)
};

const fr_emails_load_failed = /** @type {(inputs: Emails_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les modèles d'e-mail n'ont pas pu être chargés.`)
};

/**
* | output |
* | --- |
* | "The e-mail templates could not be loaded." |
*
* @param {Emails_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_load_failed = /** @type {((inputs?: Emails_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_load_failed(inputs)
	return en_emails_load_failed(inputs)
});