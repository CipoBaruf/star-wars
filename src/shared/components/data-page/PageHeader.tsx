interface PageHeaderProps {
  title: string;
  description?: string;
  showDescription?: boolean;
}

export default function PageHeader({
  title,
  description,
  showDescription = true,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">{title}</h1>
      {showDescription && description && (
        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
