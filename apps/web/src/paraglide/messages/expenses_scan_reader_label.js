/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Reader_LabelInputs */

const en_expenses_scan_reader_label = /** @type {(inputs: Expenses_Scan_Reader_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read with`)
};

const fr_expenses_scan_reader_label = /** @type {(inputs: Expenses_Scan_Reader_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire avec`)
};

/**
* | output |
* | --- |
* | "Read with" |
*
* @param {Expenses_Scan_Reader_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_reader_label = /** @type {((inputs?: Expenses_Scan_Reader_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Reader_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_reader_label(inputs)
	return en_expenses_scan_reader_label(inputs)
});