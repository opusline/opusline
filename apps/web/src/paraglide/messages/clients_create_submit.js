/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Create_SubmitInputs */

const en_clients_create_submit = /** @type {(inputs: Clients_Create_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the client`)
};

const fr_clients_create_submit = /** @type {(inputs: Clients_Create_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer le client`)
};

/**
* | output |
* | --- |
* | "Create the client" |
*
* @param {Clients_Create_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_create_submit = /** @type {((inputs?: Clients_Create_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Create_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_create_submit(inputs)
	return en_clients_create_submit(inputs)
});