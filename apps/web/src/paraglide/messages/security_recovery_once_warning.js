/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_Once_WarningInputs */

const en_security_recovery_once_warning = /** @type {(inputs: Security_Recovery_Once_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`These codes are shown once. Keep them somewhere safe: each one signs you in when the app is out of reach.`)
};

const fr_security_recovery_once_warning = /** @type {(inputs: Security_Recovery_Once_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ces codes ne s'affichent qu'une fois. Conservez-les en lieu sûr : chacun permet de vous connecter sans l'application.`)
};

/**
* | output |
* | --- |
* | "These codes are shown once. Keep them somewhere safe: each one signs you in when the app is out of reach." |
*
* @param {Security_Recovery_Once_WarningInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_once_warning = /** @type {((inputs?: Security_Recovery_Once_WarningInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_Once_WarningInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_once_warning(inputs)
	return en_security_recovery_once_warning(inputs)
});