/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Legend_ClosedInputs */



/**
* | output |
* | --- |
* | "Weekend or holiday" |
*
* @param {Cra_Legend_ClosedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_legend_closed = /** @type {((inputs?: Cra_Legend_ClosedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Legend_ClosedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Week-end ou férié")
	return /** @type {LocalizedString} */ ("Weekend or holiday")
});