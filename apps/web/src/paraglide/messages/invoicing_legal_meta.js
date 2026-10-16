/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ checkedOn: NonNullable<unknown>, nextOn: NonNullable<unknown> }} Invoicing_Legal_MetaInputs */

const en_invoicing_legal_meta = /** @type {(inputs: Invoicing_Legal_MetaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Checked on ${i?.checkedOn} · next revision of the legal rate on ${i?.nextOn}`)
};

const fr_invoicing_legal_meta = /** @type {(inputs: Invoicing_Legal_MetaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Vérifié le ${i?.checkedOn} · prochaine révision du taux légal au ${i?.nextOn}`)
};

/**
* | output |
* | --- |
* | "Checked on {checkedOn} · next revision of the legal rate on {nextOn}" |
*
* @param {Invoicing_Legal_MetaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_meta = /** @type {((inputs: Invoicing_Legal_MetaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_MetaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_meta(inputs)
	return en_invoicing_legal_meta(inputs)
});