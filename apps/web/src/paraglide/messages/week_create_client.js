/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Create_ClientInputs */

const en_week_create_client = /** @type {(inputs: Week_Create_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a client`)
};

const fr_week_create_client = /** @type {(inputs: Week_Create_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer un client`)
};

/**
* | output |
* | --- |
* | "Create a client" |
*
* @param {Week_Create_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_create_client = /** @type {((inputs?: Week_Create_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Create_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_create_client(inputs)
	return en_week_create_client(inputs)
});