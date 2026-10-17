/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Paste_Filled_LinesInputs */

const en_paste_filled_lines = /** @type {(inputs: Paste_Filled_LinesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} line`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} lines`);
	return /** @type {LocalizedString} */ ("paste_filled_lines");
};

const fr_paste_filled_lines = /** @type {(inputs: Paste_Filled_LinesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} ligne`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} lignes`);
	return /** @type {LocalizedString} */ ("paste_filled_lines");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} line" |
* | "other" | "{count} lines" |
*
* @param {Paste_Filled_LinesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_lines = /** @type {((inputs: Paste_Filled_LinesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_LinesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_lines(inputs)
	return en_paste_filled_lines(inputs)
});