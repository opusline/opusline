/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_Low_WarningInputs */

const en_security_recovery_low_warning = /** @type {(inputs: Security_Recovery_Low_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You are running out of recovery codes. Generate new ones before you need them.`)
};

const fr_security_recovery_low_warning = /** @type {(inputs: Security_Recovery_Low_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous n'avez presque plus de codes de secours. Générez-en de nouveaux avant d'en avoir besoin.`)
};

/**
* | output |
* | --- |
* | "You are running out of recovery codes. Generate new ones before you need them." |
*
* @param {Security_Recovery_Low_WarningInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_low_warning = /** @type {((inputs?: Security_Recovery_Low_WarningInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_Low_WarningInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_low_warning(inputs)
	return en_security_recovery_low_warning(inputs)
});