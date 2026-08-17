/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Kind_UrssafInputs */

const en_deadlines_kind_urssaf = /** @type {(inputs: Deadlines_Kind_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF`)
};

const fr_deadlines_kind_urssaf = /** @type {(inputs: Deadlines_Kind_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF`)
};

/**
* | output |
* | --- |
* | "URSSAF" |
*
* @param {Deadlines_Kind_UrssafInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_kind_urssaf = /** @type {((inputs?: Deadlines_Kind_UrssafInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Kind_UrssafInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_kind_urssaf(inputs)
	return en_deadlines_kind_urssaf(inputs)
});