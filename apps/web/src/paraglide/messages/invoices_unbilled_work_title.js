/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ quantity: NonNullable<unknown>, missionName: NonNullable<unknown> }} Invoices_Unbilled_Work_TitleInputs */

const en_invoices_unbilled_work_title = /** @type {(inputs: Invoices_Unbilled_Work_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quantity} on ${i?.missionName}`)
};

const fr_invoices_unbilled_work_title = /** @type {(inputs: Invoices_Unbilled_Work_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quantity} sur ${i?.missionName}`)
};

/**
* | output |
* | --- |
* | "{quantity} on {missionName}" |
*
* @param {Invoices_Unbilled_Work_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_unbilled_work_title = /** @type {((inputs: Invoices_Unbilled_Work_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Unbilled_Work_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_unbilled_work_title(inputs)
	return en_invoices_unbilled_work_title(inputs)
});