/**
 * CitationsPanel – shows the knowledge-base sources used to generate the answer.
 */

import type { Citation } from "@/lib/api";

interface Props {
  citations: Citation[];
}

export default function CitationsPanel({ citations }: Props) {
  if (!citations.length) return null;
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Sources used
      </p>
      <ul className="space-y-2">
        {citations.map((c, i) => (
          <li key={i} className="text-sm">
            <span className="font-medium text-gray-800">{c.title}</span>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{c.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
