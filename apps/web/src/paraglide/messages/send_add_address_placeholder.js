/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Add_Address_PlaceholderInputs */

const en_send_add_address_placeholder = /** @type {(inputs: Send_Add_Address_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an address: accounts@client.com`)
};

const fr_send_add_address_placeholder = /** @type {(inputs: Send_Add_Address_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une adresse : compta@client.fr`)
};

/**
* | output |
* | --- |
* | "Add an address: accounts@client.com" |
*
* @param {Send_Add_Address_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_add_address_placeholder = /** @type {((inputs?: Send_Add_Address_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Add_Address_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_add_address_placeholder(inputs)
	return en_send_add_address_placeholder(inputs)
});