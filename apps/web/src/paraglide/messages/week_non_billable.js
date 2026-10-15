/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Non_BillableInputs */

const en_week_non_billable = /** @type {(inputs: Week_Non_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non-billable`)
};

const fr_week_non_billable = /** @type {(inputs: Week_Non_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non facturable`)
};

/**
* | output |
* | --- |
* | "Non-billable" |
*
* @param {Week_Non_BillableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_non_billable = /** @type {((inputs?: Week_Non_BillableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Non_BillableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_non_billable(inputs)
	return en_week_non_billable(inputs)
});