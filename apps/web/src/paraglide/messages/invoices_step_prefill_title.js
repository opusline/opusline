/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown>, missionName: NonNullable<unknown> }} Invoices_Step_Prefill_TitleInputs */

const en_invoices_step_prefill_title = /** @type {(inputs: Invoices_Step_Prefill_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label} · ${i?.missionName}`)
};

const fr_invoices_step_prefill_title = /** @type {(inputs: Invoices_Step_Prefill_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label} · ${i?.missionName}`)
};

/**
* | output |
* | --- |
* | "{label} · {missionName}" |
*
* @param {Invoices_Step_Prefill_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_step_prefill_title = /** @type {((inputs: Invoices_Step_Prefill_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Step_Prefill_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_step_prefill_title(inputs)
	return en_invoices_step_prefill_title(inputs)
});