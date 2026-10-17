/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Preview_LabelInputs */

const en_send_preview_label = /** @type {(inputs: Send_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the client receives`)
};

const fr_send_preview_label = /** @type {(inputs: Send_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce que reçoit le client`)
};

/**
* | output |
* | --- |
* | "What the client receives" |
*
* @param {Send_Preview_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_preview_label = /** @type {((inputs?: Send_Preview_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Preview_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_preview_label(inputs)
	return en_send_preview_label(inputs)
});