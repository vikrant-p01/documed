'use client';

import { Lock } from 'lucide-react';

export function ImmutableRecordBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-immutable-bg text-immutable">
      <Lock className="w-3 h-3" />
      Immutable
    </div>
  );
}

export function ImmutableRecordNotice() {
  return (
    <p className="text-xs text-muted-foreground italic">
      This record is permanent and cannot be edited or deleted. All changes are logged in the audit trail.
    </p>
  );
}

export function RecordMetadata({
  date,
  provider,
  role,
}: {
  date: string;
  provider: string;
  role: string;
}) {
  return (
    <div className="text-xs space-y-1">
      <div className="flex justify-between text-muted-foreground">
        <span>Date: {date}</span>
        <span>By: {provider}</span>
      </div>
      <p className="text-muted-foreground">{role}</p>
    </div>
  );
}
