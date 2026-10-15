/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_File_NameInputs */

const en_security_recovery_file_name = /** @type {(inputs: Security_Recovery_File_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`opusline-recovery-codes.txt`)
};

const fr_security_recovery_file_name = /** @type {(inputs: Security_Recovery_File_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`opusline-codes-de-secours.txt`)
};

/**
* | output |
* | --- |
* | "opusline-recovery-codes.txt" |
*
* @param {Security_Recovery_File_NameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_file_name = /** @type {((inputs?: Security_Recovery_File_NameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_File_NameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_file_name(inputs)
	return en_security_recovery_file_name(inputs)
});