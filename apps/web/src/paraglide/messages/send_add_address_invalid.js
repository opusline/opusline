/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Add_Address_InvalidInputs */

const en_send_add_address_invalid = /** @type {(inputs: Send_Add_Address_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That is not an e-mail address.`)
};

const fr_send_add_address_invalid = /** @type {(inputs: Send_Add_Address_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce n'est pas une adresse e-mail.`)
};

/**
* | output |
* | --- |
* | "That is not an e-mail address." |
*
* @param {Send_Add_Address_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_add_address_invalid = /** @type {((inputs?: Send_Add_Address_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Add_Address_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_add_address_invalid(inputs)
	return en_send_add_address_invalid(inputs)
});