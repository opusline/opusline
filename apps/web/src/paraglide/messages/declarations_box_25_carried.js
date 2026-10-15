/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Box_25_CarriedInputs */



/**
* | output |
* | --- |
* | "carried to box 22 on the next CA3 · refundable at year end if ≥ 150 €" |
*
* @param {Declarations_Box_25_CarriedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_25_carried = /** @type {((inputs?: Declarations_Box_25_CarriedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_25_CarriedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("reporté en case 22 sur la CA3 suivante · remboursable en fin d'année si ≥ 150 €")
	return /** @type {LocalizedString} */ ("carried to box 22 on the next CA3 · refundable at year end if ≥ 150 €")
});