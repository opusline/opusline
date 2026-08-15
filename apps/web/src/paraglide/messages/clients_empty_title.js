/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Empty_TitleInputs */

const en_clients_empty_title = /** @type {(inputs: Clients_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create your first client`)
};

const fr_clients_empty_title = /** @type {(inputs: Clients_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez votre premier client`)
};

/**
* | output |
* | --- |
* | "Create your first client" |
*
* @param {Clients_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_empty_title = /** @type {((inputs?: Clients_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_empty_title(inputs)
	return en_clients_empty_title(inputs)
});