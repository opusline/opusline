/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rate_Not_BillableInputs */

const en_missions_rate_not_billable = /** @type {(inputs: Missions_Rate_Not_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not billable`)
};

const fr_missions_rate_not_billable = /** @type {(inputs: Missions_Rate_Not_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`non facturable`)
};

/**
* | output |
* | --- |
* | "not billable" |
*
* @param {Missions_Rate_Not_BillableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rate_not_billable = /** @type {((inputs?: Missions_Rate_Not_BillableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rate_Not_BillableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rate_not_billable(inputs)
	return en_missions_rate_not_billable(inputs)
});