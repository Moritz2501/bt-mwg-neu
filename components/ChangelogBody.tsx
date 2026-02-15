type ChangelogBodyProps = {
  body: string;
  className?: string;
};

type TextBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

function parseBlocks(body: string): TextBlock[] {
  const lines = body.split("\n");
  const blocks: TextBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({ type: "paragraph", text: paragraphLines.join("\n") });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push({ type: "list", items: listItems });
    listItems = [];
  };

  for (const rawLine of lines) {
    const bulletMatch = rawLine.match(/^\s*[-*]\s+(.+)$/);
    const line = rawLine.trim();

    if (bulletMatch) {
      flushParagraph();
      listItems.push(bulletMatch[1]);
      continue;
    }

    if (line.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraphLines.push(rawLine);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export default function ChangelogBody({ body, className }: ChangelogBodyProps) {
  const blocks = parseBlocks(body);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="list-disc pl-5 space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={`item-${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="whitespace-pre-line">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
