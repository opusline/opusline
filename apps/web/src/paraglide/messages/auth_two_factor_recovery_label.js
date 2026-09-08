/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Recovery_LabelInputs */

const en_auth_two_factor_recovery_label = /** @type {(inputs: Auth_Two_Factor_Recovery_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recovery code`)
};

const fr_auth_two_factor_recovery_label = /** @type {(inputs: Auth_Two_Factor_Recovery_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code de secours`)
};

/**
* | output |
* | --- |
* | "Recovery code" |
*
* @param {Auth_Two_Factor_Recovery_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_recovery_label = /** @type {((inputs?: Auth_Two_Factor_Recovery_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Recovery_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_recovery_label(inputs)
	return en_auth_two_factor_recovery_label(inputs)
});