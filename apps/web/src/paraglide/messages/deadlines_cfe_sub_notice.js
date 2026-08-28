/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Cfe_Sub_NoticeInputs */

const en_deadlines_cfe_sub_notice = /** @type {(inputs: Deadlines_Cfe_Sub_NoticeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notice available in November on your espace professionnel`)
};

const fr_deadlines_cfe_sub_notice = /** @type {(inputs: Deadlines_Cfe_Sub_NoticeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avis disponible en novembre sur votre espace professionnel`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_cfe_sub_notice(inputs)
	return en_deadlines_cfe_sub_notice(inputs)
});