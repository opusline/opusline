/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Create_And_ChainInputs */

const en_clients_create_and_chain = /** @type {(inputs: Clients_Create_And_ChainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create and go on to a mission`)
};

const fr_clients_create_and_chain = /** @type {(inputs: Clients_Create_And_ChainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer et enchaîner sur une mission`)
};

/**
* | output |
* | --- |
* | "Create and go on to a mission" |
*
* @param {Clients_Create_And_ChainInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_create_and_chain = /** @type {((inputs?: Clients_Create_And_ChainInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Create_And_ChainInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_create_and_chain(inputs)
	return en_clients_create_and_chain(inputs)
});