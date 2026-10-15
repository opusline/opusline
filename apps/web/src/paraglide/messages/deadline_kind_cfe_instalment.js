/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_Cfe_InstalmentInputs */



/**
* | output |
* | --- |
* | "CFE — acompte" |
*
* @param {Deadline_Kind_Cfe_InstalmentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_kind_cfe_instalment = /** @type {((inputs?: Deadline_Kind_Cfe_InstalmentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Kind_Cfe_InstalmentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("CFE — acompte")
	return /** @type {LocalizedString} */ ("CFE — acompte")
});