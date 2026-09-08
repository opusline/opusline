/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Confirm_Password_SubmitInputs */

const en_security_confirm_password_submit = /** @type {(inputs: Security_Confirm_Password_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm`)
};

const fr_security_confirm_password_submit = /** @type {(inputs: Security_Confirm_Password_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer`)
};

/**
* | output |
* | --- |
* | "Confirm" |
*
* @param {Security_Confirm_Password_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_confirm_password_submit = /** @type {((inputs?: Security_Confirm_Password_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Confirm_Password_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_confirm_password_submit(inputs)
	return en_security_confirm_password_submit(inputs)
});