/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Name_LabelInputs */

const en_auth_name_label = /** @type {(inputs: Auth_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const fr_auth_name_label = /** @type {(inputs: Auth_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Auth_Name_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_name_label = /** @type {((inputs?: Auth_Name_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Name_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_name_label(inputs)
	return en_auth_name_label(inputs)
});