/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Send_Copy_MeInputs */

const en_send_copy_me = /** @type {(inputs: Send_Copy_MeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Copy me (${i?.email})`)
};

const fr_send_copy_me = /** @type {(inputs: Send_Copy_MeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Me mettre en copie (${i?.email})`)
};

/**
* | output |
* | --- |
* | "Copy me ({email})" |
*
* @param {Send_Copy_MeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_copy_me = /** @type {((inputs: Send_Copy_MeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Copy_MeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_copy_me(inputs)
	return en_send_copy_me(inputs)
});