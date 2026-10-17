/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_No_ContactsInputs */

const en_send_no_contacts = /** @type {(inputs: Send_No_ContactsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No address on the client record. Add one below.`)
};

const fr_send_no_contacts = /** @type {(inputs: Send_No_ContactsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune adresse sur la fiche client. Ajoutez-en une ci-dessous.`)
};

/**
* | output |
* | --- |
* | "No address on the client record. Add one below." |
*
* @param {Send_No_ContactsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_no_contacts = /** @type {((inputs?: Send_No_ContactsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_No_ContactsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_no_contacts(inputs)
	return en_send_no_contacts(inputs)
});