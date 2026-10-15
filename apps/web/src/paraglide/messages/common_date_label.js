/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Date_LabelInputs */

const en_common_date_label = /** @type {(inputs: Common_Date_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

const fr_common_date_label = /** @type {(inputs: Common_Date_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

/**
* | output |
* | --- |
* | "Date" |
*
* @param {Common_Date_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_date_label = /** @type {((inputs?: Common_Date_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Date_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_date_label(inputs)
	return en_common_date_label(inputs)
});