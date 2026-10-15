/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Todo_Step_GridInputs */

const en_clients_todo_step_grid = /** @type {(inputs: Clients_Todo_Step_GridInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The mission appears as a row in the week`)
};

const fr_clients_todo_step_grid = /** @type {(inputs: Clients_Todo_Step_GridInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La mission apparaît en ligne dans la semaine`)
};

/**
* | output |
* | --- |
* | "The mission appears as a row in the week" |
*
* @param {Clients_Todo_Step_GridInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_todo_step_grid = /** @type {((inputs?: Clients_Todo_Step_GridInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Todo_Step_GridInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_todo_step_grid(inputs)
	return en_clients_todo_step_grid(inputs)
});