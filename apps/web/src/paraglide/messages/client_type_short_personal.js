/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Client_Type_Short_PersonalInputs */

const en_client_type_short_personal = /** @type {(inputs: Client_Type_Short_PersonalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personal`)
};

const fr_client_type_short_personal = /** @type {(inputs: Client_Type_Short_PersonalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Perso`)
};

/**
* | output |
* | --- |
* | "Personal" |
*
* @param {Client_Type_Short_PersonalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const client_type_short_personal = /** @type {((inputs?: Client_Type_Short_PersonalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Client_Type_Short_PersonalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_client_type_short_personal(inputs)
	return en_client_type_short_personal(inputs)
});