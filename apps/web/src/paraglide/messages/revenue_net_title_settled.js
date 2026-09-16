/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Net_Title_SettledInputs */

const en_revenue_net_title_settled = /** @type {(inputs: Revenue_Net_Title_SettledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net after URSSAF`)
};

const fr_revenue_net_title_settled = /** @type {(inputs: Revenue_Net_Title_SettledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net après URSSAF`)
};

/**
* | output |
* | --- |
* | "Net after URSSAF" |
*
* @param {Revenue_Net_Title_SettledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_net_title_settled = /** @type {((inputs?: Revenue_Net_Title_SettledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Net_Title_SettledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_net_title_settled(inputs)
	return en_revenue_net_title_settled(inputs)
});