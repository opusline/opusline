/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_RegenerateInputs */

const en_security_recovery_regenerate = /** @type {(inputs: Security_Recovery_RegenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New recovery codes`)
};

const fr_security_recovery_regenerate = /** @type {(inputs: Security_Recovery_RegenerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveaux codes de secours`)
};

/**
* | output |
* | --- |
* | "New recovery codes" |
*
* @param {Security_Recovery_RegenerateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_regenerate = /** @type {((inputs?: Security_Recovery_RegenerateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_RegenerateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_regenerate(inputs)
	return en_security_recovery_regenerate(inputs)
});