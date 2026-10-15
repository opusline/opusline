/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Load_FailedInputs */

const en_security_load_failed = /** @type {(inputs: Security_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The security settings could not be loaded.`)
};

const fr_security_load_failed = /** @type {(inputs: Security_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les réglages de sécurité n'ont pas pu être chargés.`)
};

/**
* | output |
* | --- |
* | "The security settings could not be loaded." |
*
* @param {Security_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_load_failed = /** @type {((inputs?: Security_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_load_failed(inputs)
	return en_security_load_failed(inputs)
});