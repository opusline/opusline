/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_View_ClientsInputs */

const en_week_view_clients = /** @type {(inputs: Week_View_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View my clients`)
};

const fr_week_view_clients = /** @type {(inputs: Week_View_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voir mes clients`)
};

/**
* | output |
* | --- |
* | "View my clients" |
*
* @param {Week_View_ClientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_view_clients = /** @type {((inputs?: Week_View_ClientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_View_ClientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_view_clients(inputs)
	return en_week_view_clients(inputs)
});