/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Mission_Over_BudgetInputs */

const en_clients_mission_over_budget = /** @type {(inputs: Clients_Mission_Over_BudgetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`over budget`)
};

const fr_clients_mission_over_budget = /** @type {(inputs: Clients_Mission_Over_BudgetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`budget dépassé`)
};

/**
* | output |
* | --- |
* | "over budget" |
*
* @param {Clients_Mission_Over_BudgetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_mission_over_budget = /** @type {((inputs?: Clients_Mission_Over_BudgetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Mission_Over_BudgetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_mission_over_budget(inputs)
	return en_clients_mission_over_budget(inputs)
});