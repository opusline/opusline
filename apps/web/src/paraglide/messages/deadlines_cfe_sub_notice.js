/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Cfe_Sub_NoticeInputs */



/**
* | output |
* | --- |
* | "Notice available in November on your espace professionnel" |
*
* @param {Deadlines_Cfe_Sub_NoticeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_cfe_sub_notice = /** @type {((inputs?: Deadlines_Cfe_Sub_NoticeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Cfe_Sub_NoticeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Avis disponible en novembre sur votre espace professionnel")
	return /** @type {LocalizedString} */ ("Notice available in November on your espace professionnel")
});