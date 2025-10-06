import { useEffect, useState } from 'react';

export function useSearchList(fetcher, { initialQ = '', initialSelect = '', pageSize = 24 } = {}) {
  const [q, setQ] = useState(initialQ);
  const [select, setSelect] = useState(initialSelect); // ej. categoryId
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(false);
  const [limit] = useState(pageSize);
  const [offset, setOffset] = useState(0);

  // debounce 300ms
  const [dq, setDq] = useState(q);
  useEffect(() => { const t = setTimeout(() => setDq(q), 300); return () => clearTimeout(t); }, [q]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setPending(true);
      try {
        const { total, items } = await fetcher({ q: dq, select, limit, offset });
        if (!alive) return;
        setItems(items || []);
        setTotal(Number(total || 0));
      } finally {
        if (alive) setPending(false);
      }
    })();
    return () => { alive = false; };
  }, [fetcher, dq, select, limit, offset]);

  const onChangeQ = (v) => { setOffset(0); setQ(v); };
  const onChangeSelect = (v) => { setOffset(0); setSelect(v); };

  return { q, setQ: onChangeQ, select, setSelect: onChangeSelect, items, total, pending, limit, offset, setOffset };
}
