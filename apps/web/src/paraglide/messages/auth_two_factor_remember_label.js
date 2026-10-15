/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Remember_LabelInputs */

const en_auth_two_factor_remember_label = /** @type {(inputs: Auth_Two_Factor_Remember_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remember this browser for 30 days`)
};

const fr_auth_two_factor_remember_label = /** @type {(inputs: Auth_Two_Factor_Remember_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se souvenir de ce navigateur pendant 30 jours`)
};

/**
* | output |
* | --- |
* | "Remember this browser for 30 days" |
*
* @param {Auth_Two_Factor_Remember_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_remember_label = /** @type {((inputs?: Auth_Two_Factor_Remember_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Remember_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_remember_label(inputs)
	return en_auth_two_factor_remember_label(inputs)
});