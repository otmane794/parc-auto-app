export function Th({ children }) {
  return (
    <th className="border-b border-slate-100 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}

export function Td({ children, className = "", ...rest }) {
  return (
    <td className={`border-b border-slate-50 px-4 py-3.5 text-sm text-slate-700 ${className}`} {...rest}>
      {children}
    </td>
  );
}
