import { Fragment } from "react";

type RichMessageProps = {
  message: string;
  strongClassName?: string;
};

/**
 * Renders a message carrying <strong>…</strong> markers, so a bold phrase can
 * sit wherever the translation puts it instead of the sentence being split
 * into order-frozen fragment keys.
 */
export function RichMessage({ message, strongClassName }: RichMessageProps) {
  let offset = 0;

  const segments = message
    .split(/<strong>(.*?)<\/strong>/g)
    .map((text, index) => {
      const segment = { key: offset, strong: index % 2 === 1, text };
      offset += text.length + 1;

      return segment;
    });

  return (
    <>
      {segments.map(({ key, strong, text }) =>
        strong ? (
          <strong className={strongClassName} key={key}>
            {text}
          </strong>
        ) : (
          <Fragment key={key}>{text}</Fragment>
        ),
      )}
    </>
  );
}
