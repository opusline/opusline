/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ file: NonNullable<unknown> }} Expenses_Scan_ReadingInputs */

const en_expenses_scan_reading = /** @type {(inputs: Expenses_Scan_ReadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reading ${i?.file}…`)
};

const fr_expenses_scan_reading = /** @type {(inputs: Expenses_Scan_ReadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lecture de ${i?.file}…`)
};

/**
* | output |
* | --- |
* | "Reading {file}…" |
*
* @param {Expenses_Scan_ReadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_reading = /** @type {((inputs: Expenses_Scan_ReadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_ReadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_reading(inputs)
	return en_expenses_scan_reading(inputs)
});