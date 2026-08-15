/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Repeat_ButtonInputs */

const en_week_repeat_button = /** @type {(inputs: Week_Repeat_ButtonInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Copy the entry`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Copy the ${i?.count} entries`);
	return /** @type {LocalizedString} */ ("week_repeat_button");
};

const fr_week_repeat_button = /** @type {(inputs: Week_Repeat_ButtonInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Reprendre l'entrée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Reprendre les ${i?.count} entrées`);
	return /** @type {LocalizedString} */ ("week_repeat_button");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Copy the entry" |
* | "other" | "Copy the {count} entries" |
*
* @param {Week_Repeat_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_repeat_button = /** @type {((inputs: Week_Repeat_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Repeat_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_repeat_button(inputs)
	return en_week_repeat_button(inputs)
});