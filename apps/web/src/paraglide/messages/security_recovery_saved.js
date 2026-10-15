/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_SavedInputs */

const en_security_recovery_saved = /** @type {(inputs: Security_Recovery_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I saved my codes`)
};

const fr_security_recovery_saved = /** @type {(inputs: Security_Recovery_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`J'ai enregistré mes codes`)
};

/**
* | output |
* | --- |
* | "I saved my codes" |
*
* @param {Security_Recovery_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_saved = /** @type {((inputs?: Security_Recovery_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_recovery_saved(inputs)
	return en_security_recovery_saved(inputs)
});