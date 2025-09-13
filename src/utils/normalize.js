export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === string) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (typeof value === object) return Object.values(value);
  return [];
}
export function pickList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.categories)) return data.categories;
  if (typeof data === object) return Object.values(data);
  return [];
}
export function pickEntity(data) {
  if (!data) return null;
  if (data.product) return data.product;
  if (data.category) return data.category;
  if (data.data && typeof data.data === object) return data.data;
  return data;
}
export function getId(entity) {
  return entity?.id ?? entity?._id ?? entity?.uuid ?? null;
}
EOF
cat > src/api/client.js <<\"EOF\"
import axios from axios;
const baseURL =
  (typeof import !== undefined && import.meta?.env?.VITE_API_URL) ||
  (typeof process !== undefined && process?.env?.NEXT_PUBLIC_API_URL) ||
  ;
export const api = axios.create({
  baseURL,
  // withCredentials: true,
});
EOF
cat > src/api/products.js <<\"EOF\"
import { api } from ./client;
import { pickList, pickEntity, getId } from ../utils/normalize;
export async function fetchProducts() { const { data } = await api.get(/api/products); return pickList(data); }
export async function createProduct(payload) { const { data } = await api.post(/api/products, payload, { headers: { Content-Type: application/json } }); return pickEntity(data) || null; }
export async function updateProduct(id, changes) { const { data } = await api.patch(\`/api/products/\${id}\`, changes, { headers: { Content-Type: application/json } }); return pickEntity(data) || null; }
export async function deleteProduct(id) { await api.delete(\`/api/products/\${id}\`); return true; }
export function getEntityId(entity) { return getId(entity); }
EOF
cat > src/api/categories.js <<\"EOF\"
import { api } from ./client;
import { pickList, pickEntity, getId } from ../utils/normalize;
export async function fetchCategories() { const { data } = await api.get(/api/categories); return pickList(data); }
export async function createCategory(payload) { const { data } = await api.post(/api/categories, payload, { headers: { Content-Type: application/json } }); return pickEntity(data) || null; }
export async function updateCategory(id, changes) { const { data } = await api.patch(\`/api/categories/\${id}\`, changes, { headers: { Content-Type: application/json } }); return pickEntity(data) || null; }
export async function deleteCategory(id) { await api.delete(\`/api/categories/\${id}\`); return true; }
export function getEntityId(entity) { return getId(entity); }
EOF
cat > src/hooks/useCollection.js <<\"EOF\"
import { useCallback, useEffect, useMemo, useState } from react;
import { toArray } from ../utils/normalize;
export function useCollection(service) {
  const [list, setList] = useState([]); const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState(null);
  const load = useCallback(async () => { setIsLoading(true); setError(null); try { const items = await service.fetchList(); setList(toArray(items)); } catch(e) { setError(e); setList([]); } finally { setIsLoading(false); } }, [service]);
  useEffect(() => { load(); }, [load]);
  const create = useCallback(async (payload) => { try { const created = await service.createOne(payload); if (!created) { await load(); return null; } const id = service.getEntityId(created); setList(prev => { const next = toArray(prev); return id != null && next.some(x => service.getEntityId(x) === id) ? next : [created, ...next]; }); return created; } catch(e){ setError(e); await load(); return null; } }, [service, load]);
  const update = useCallback(async (id, changes) => { try { const updated = await service.updateOne(id, changes); if (!updated) { await load(); return null; } const updatedId = service.getEntityId(updated) ?? id; setList(prev => toArray(prev).map(item => service.getEntityId(item) === updatedId ? { ...item, ...updated } : item)); return updated; } catch(e){ setError(e); await load(); return null; } }, [service, load]);
  const remove = useCallback(async (id) => { try { await service.deleteOne(id); setList(prev => toArray(prev).filter(item => service.getEntityId(item) !== id)); return true; } catch(e){ setError(e); await load(); return false; } }, [service, load]);
  return { list: useMemo(() => toArray(list), [list]), isLoading, error, reload: load, create, update, remove };
}
EOF
cat > src/hooks/useProducts.js <<\"EOF\"
import { useCollection } from ./useCollection;
import * as svc from ../api/products;
const service = { fetchList: svc.fetchProducts, createOne: svc.createProduct, updateOne: svc.updateProduct, deleteOne: svc.deleteProduct, getEntityId: svc.getEntityId };
export function useProducts() { return useCollection(service); }
EOF
cat > src/hooks/useCategories.js <<\"EOF\"
import { useCollection } from ./useCollection;
import * as svc from ../api/categories;
const service = { fetchList: svc.fetchCategories, createOne: svc.createCategory, updateOne: svc.updateCategory, deleteOne: svc.deleteCategory, getEntityId: svc.getEntityId };
export function useCategories() { return useCollection(service); }
EOF
[ -f .env.example ] || cat > .env.example <<\"EOF\"
VITE_API_URL=http://localhost:5000
# NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
# Best-effort backend body parser insert (Express)
for f in server.js app.js index.js; do
  for d in . server backend api; do
    p=\"$d/$f\"
    [ -f \"$p\" ] || continue
    if grep -q \"express()\" \"$p\" && ! grep -q \"express.json()\" \"$p\"; then
      cp \"$p\" \"$p.bak\"
      awk '{print} /express\\(\\);/ && !done {print \"app.use(express.json());\"; print \"app.use(express.urlencoded({ extended: true }));\"; done=1 }' done=0 \"$p\" > \"$p.tmp\" && mv \"$p.tmp\" \"$p\" || mv \"$p.bak\" \"$p\"
    fi
  done
done
git add -A; git commit -m \"Add normalization utils, API services, and collection hooks; ensure Express parses JSON bodies\" >/dev/null || true; if git remote >/dev/null 2>&1; then git push -u \$(git remote | head -n1) \"$BR\"; else echo \"No git remote configured; skipped push.\"; fi; echo \"Branch: $BR\"
