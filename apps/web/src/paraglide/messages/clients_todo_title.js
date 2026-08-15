/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Todo_TitleInputs */

const en_clients_todo_title = /** @type {(inputs: Clients_Todo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What remains to do`)
};

const fr_clients_todo_title = /** @type {(inputs: Clients_Todo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce qui reste à faire`)
};

/**
* | output |
* | --- |
* | "What remains to do" |
*
* @param {Clients_Todo_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_todo_title = /** @type {((inputs?: Clients_Todo_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Todo_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_todo_title(inputs)
	return en_clients_todo_title(inputs)
});