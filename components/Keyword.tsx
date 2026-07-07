export default function Keyword({
  children,
  tone = "correction",
}: {
  children: React.ReactNode;
  tone?: "correction" | "amelioration" | "neutral";
}) {
  const styles = {
    correction: "text-clay dark:text-rose",
    amelioration: "text-zellige2 dark:text-saffron",
    neutral: "text-ink dark:text-sand",
  };

  return (
    <bdi className={`font-semibold ${styles[tone]}`}>{children}</bdi>
  );
}
