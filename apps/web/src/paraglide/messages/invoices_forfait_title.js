/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ missionName: NonNullable<unknown> }} Invoices_Forfait_TitleInputs */

const en_invoices_forfait_title = /** @type {(inputs: Invoices_Forfait_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fixed price · ${i?.missionName}`)
};

const fr_invoices_forfait_title = /** @type {(inputs: Invoices_Forfait_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Forfait · ${i?.missionName}`)
};

/**
* | output |
* | --- |
* | "Fixed price · {missionName}" |
*
* @param {Invoices_Forfait_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_forfait_title = /** @type {((inputs: Invoices_Forfait_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Forfait_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_forfait_title(inputs)
	return en_invoices_forfait_title(inputs)
});