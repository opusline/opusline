/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Empty_Body_CollectedInputs */

const en_revenue_empty_body_collected = /** @type {(inputs: Revenue_Empty_Body_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No payment landed over this period. Pending invoices are tracked on the Invoices screen.`)
};

const fr_revenue_empty_body_collected = /** @type {(inputs: Revenue_Empty_Body_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun règlement n'est arrivé sur cette période. Les factures en attente sont suivies dans l'écran Factures.`)
};

/**
* | output |
* | --- |
* | "No payment landed over this period. Pending invoices are tracked on the Invoices screen." |
*
* @param {Revenue_Empty_Body_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_empty_body_collected = /** @type {((inputs?: Revenue_Empty_Body_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Empty_Body_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_empty_body_collected(inputs)
	return en_revenue_empty_body_collected(inputs)
});