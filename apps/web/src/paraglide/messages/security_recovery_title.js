/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_TitleInputs */

const en_security_recovery_title = /** @type {(inputs: Security_Recovery_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recovery codes`)
};

const fr_security_recovery_title = /** @type {(inputs: Security_Recovery_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Codes de secours`)
};

/**
* | output |
* | --- |
* | "Recovery codes" |
*
* @param {Security_Recovery_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_title = /** @type {((inputs?: Security_Recovery_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_title(inputs)
	return en_security_recovery_title(inputs)
});