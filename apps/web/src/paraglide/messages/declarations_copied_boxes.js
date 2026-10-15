/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Declarations_Copied_BoxesInputs */

const en_declarations_copied_boxes = /** @type {(inputs: Declarations_Copied_BoxesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} box copied`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} boxes copied`);
	return /** @type {LocalizedString} */ ("declarations_copied_boxes");
};

const fr_declarations_copied_boxes = /** @type {(inputs: Declarations_Copied_BoxesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} case copiée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} cases copiées`);
	return /** @type {LocalizedString} */ ("declarations_copied_boxes");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} box copied" |
* | "other" | "{count} boxes copied" |
*
* @param {Declarations_Copied_BoxesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_copied_boxes = /** @type {((inputs: Declarations_Copied_BoxesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Copied_BoxesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_copied_boxes(inputs)
	return en_declarations_copied_boxes(inputs)
});