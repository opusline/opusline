/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Add_AddressInputs */

const en_send_add_address = /** @type {(inputs: Send_Add_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add`)
};

const fr_send_add_address = /** @type {(inputs: Send_Add_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter`)
};

/**
* | output |
* | --- |
* | "Add" |
*
* @param {Send_Add_AddressInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_add_address = /** @type {((inputs?: Send_Add_AddressInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Add_AddressInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_add_address(inputs)
	return en_send_add_address(inputs)
});