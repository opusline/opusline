/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_UrssafInputs */

const en_deadline_kind_urssaf = /** @type {(inputs: Deadline_Kind_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déclaration URSSAF`)
};

const fr_deadline_kind_urssaf = /** @type {(inputs: Deadline_Kind_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déclaration URSSAF`)
};

/**
* | output |
* | --- |
* | "Déclaration URSSAF" |
*
* @param {Deadline_Kind_UrssafInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_kind_urssaf = /** @type {((inputs?: Deadline_Kind_UrssafInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Kind_UrssafInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_kind_urssaf(inputs)
	return en_deadline_kind_urssaf(inputs)
});