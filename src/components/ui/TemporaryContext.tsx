export function TemporaryContext({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="temp-context" aria-label={`Temporary context: ${title}`}>
      <p className="temp-context__eyebrow">Temporary context</p>
      <p className="temp-context__title">{title}</p>
      <div className="temp-context__body">{children}</div>
    </aside>
  );
}
