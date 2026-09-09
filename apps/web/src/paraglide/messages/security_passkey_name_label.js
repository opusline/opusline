/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Name_LabelInputs */

const en_security_passkey_name_label = /** @type {(inputs: Security_Passkey_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const fr_security_passkey_name_label = /** @type {(inputs: Security_Passkey_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Security_Passkey_Name_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_name_label = /** @type {((inputs?: Security_Passkey_Name_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Name_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_name_label(inputs)
	return en_security_passkey_name_label(inputs)
});