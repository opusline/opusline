/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_CfeInputs */

const en_deadline_kind_cfe = /** @type {(inputs: Deadline_Kind_CfeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE`)
};

const fr_deadline_kind_cfe = /** @type {(inputs: Deadline_Kind_CfeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE`)
};

/**
* | output |
* | --- |
* | "CFE" |
*
* @param {Deadline_Kind_CfeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_kind_cfe = /** @type {((inputs?: Deadline_Kind_CfeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Kind_CfeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_kind_cfe(inputs)
	return en_deadline_kind_cfe(inputs)
});