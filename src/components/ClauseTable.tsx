interface Clause {
  name: string;
  summary: string;
}

interface ClauseTableProps {
  title: string;
  clauses: Clause[];
}

export const ClauseTable = ({ title, clauses }: ClauseTableProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold text-primary mb-6">
        {title}
      </h2>
      
      <div className="space-y-1">
        <div className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-4 pb-3 border-b border-border">
          <div className="font-semibold text-sm text-foreground">Clause</div>
          <div className="font-semibold text-sm text-foreground">Summary</div>
        </div>
        
        {clauses.map((clause, index) => (
          <div 
            key={index}
            className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-4 py-4 border-b border-border last:border-0"
          >
            <div className="font-medium text-sm text-foreground">
              {clause.name}
            </div>
            <div className="text-sm text-muted-foreground break-words">
              {clause.summary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
