/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Reader_ServerInputs */

const en_expenses_scan_reader_server = /** @type {(inputs: Expenses_Scan_Reader_ServerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The server`)
};

const fr_expenses_scan_reader_server = /** @type {(inputs: Expenses_Scan_Reader_ServerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le serveur`)
};

/**
* | output |
* | --- |
* | "The server" |
*
* @param {Expenses_Scan_Reader_ServerInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_reader_server = /** @type {((inputs?: Expenses_Scan_Reader_ServerInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Reader_ServerInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_reader_server(inputs)
	return en_expenses_scan_reader_server(inputs)
});