/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Create_And_ChainInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Créer et enchaîner sur une mission")
	return /** @type {LocalizedString} */ ("Create and go on to a mission")
});