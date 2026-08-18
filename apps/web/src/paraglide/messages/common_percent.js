/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Common_PercentInputs */

const en_common_percent = /** @type {(inputs: Common_PercentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} %`)
};

const fr_common_percent = /** @type {(inputs: Common_PercentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} %`)
};

/**
* | output |
* | --- |
* | "{value} %" |
*
* @param {Common_PercentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_percent = /** @type {((inputs: Common_PercentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_PercentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_percent(inputs)
	return en_common_percent(inputs)
});