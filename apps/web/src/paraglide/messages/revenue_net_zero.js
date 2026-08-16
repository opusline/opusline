/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Net_ZeroInputs */

const en_revenue_net_zero = /** @type {(inputs: Revenue_Net_ZeroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to contribute over the period`)
};

const fr_revenue_net_zero = /** @type {(inputs: Revenue_Net_ZeroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien à cotiser sur la période`)
};

/**
* | output |
* | --- |
* | "Nothing to contribute over the period" |
*
* @param {Revenue_Net_ZeroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_net_zero = /** @type {((inputs?: Revenue_Net_ZeroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Net_ZeroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_net_zero(inputs)
	return en_revenue_net_zero(inputs)
});