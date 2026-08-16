/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Net_TitleInputs */

const en_revenue_net_title = /** @type {(inputs: Revenue_Net_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimated net after URSSAF`)
};

const fr_revenue_net_title = /** @type {(inputs: Revenue_Net_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimation net après URSSAF`)
};

/**
* | output |
* | --- |
* | "Estimated net after URSSAF" |
*
* @param {Revenue_Net_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_net_title = /** @type {((inputs?: Revenue_Net_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Net_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_net_title(inputs)
	return en_revenue_net_title(inputs)
});