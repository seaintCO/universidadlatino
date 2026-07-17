type ProgressProps = {
  value: number;
  label?: string;
};

export function Progress({ value, label }: ProgressProps) {
  const normalizedValue = Math.max(0, Math.min(value, 100));

  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#686c66]">
          <span>{label}</span>
          <span>{normalizedValue}%</span>
        </div>
      ) : null}

      <div className="h-2 overflow-hidden rounded-full bg-[#efede7]">
        <div
          className="h-full rounded-full bg-[#2f6650] transition-[width]"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
