import Keyword from "@/components/Keyword";

export function renderExplanation(
  text: string,
  tone: "correction" | "amelioration"
): React.ReactNode[] {
  if (!text) return [];

  const parts = text.split(/(\*\*[^*]+\*\*|«[^»]+»)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Keyword key={i} tone={tone}>
          {part.slice(2, -2)}
        </Keyword>
      );
    }
    if (part.startsWith("«") && part.endsWith("»")) {
      return (
        <bdi key={i} className="font-medium">
          {part}
        </bdi>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
