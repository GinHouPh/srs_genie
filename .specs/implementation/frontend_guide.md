---
tier: 4
role: frontend-implementation-guide
depends-on: contracts/ui_contracts.md · contracts/api_contracts.md · architecture/system_design.md
feeds-into: execution/tasks.md · implementation/testing_strategy.md
owner: AI-generated · human-approved
updated: YYYY-MM-DD
---

# Frontend guide

> AI instruction: Generate all frontend code to match the patterns in this file.
> Component props must match ui_contracts.md exactly. API calls must hit endpoints
> defined in api_contracts.md. Do not import libraries not listed here.

---

## Folder structure

```
src/
├── pages/             # route-level components (one per route in ui_contracts.md)
├── components/
│   ├── ui/            # stateless display components (Button, Input, Card, etc.)
│   └── features/      # stateful feature components grouped by resource
│       └── [resource]/
│           ├── [Resource]List.tsx
│           ├── [Resource]Form.tsx
│           └── [Resource]Card.tsx
├── hooks/             # custom React hooks — one per concern
│   ├── use[Resource].ts      # fetches + caches resource data
│   └── useAuth.ts            # exposes current user, login, logout
├── api/               # API client functions — one file per resource
│   ├── client.ts      # base fetch wrapper with auth header injection
│   └── [resource].api.ts
├── store/             # global state (if needed — see State management below)
├── types/             # TypeScript types (derived from ui_contracts.md)
└── lib/               # utilities (date formatting, validation helpers, etc.)
```

---

## State management

**Approach:** [e.g. React Query for server state + React Context for auth / Zustand for client state]

**Rule:** Server state (API data) goes in [React Query / SWR]. Client-only state (UI toggles, form values) goes in local `useState`. Global client state (current user, theme) goes in [Context / Zustand]. Do not put server data in global client state.

---

## API client pattern

```typescript
// api/client.ts — base wrapper with auth injection
const apiCall = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const token = getToken(); // from auth store
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(error.error.code, error.error.message, res.status);
  }
  return res.json();
};

// api/[resource].api.ts — typed endpoint calls
export const get[Resource]List = (params: ListParams) =>
  apiCall<PaginatedResponse<[Resource]>>(`/[resource]?page=${params.page}&limit=${params.limit}`);

export const create[Resource] = (data: Create[Resource]Dto) =>
  apiCall<[Resource]>('/[resource]', { method: 'POST', body: JSON.stringify(data) });
```

---

## Data fetching pattern

```typescript
// hooks/use[Resource].ts
export const use[Resource]List = (page: number) => {
  return useQuery({
    queryKey: ['[resource]', page],
    queryFn: () => get[Resource]List({ page }),
    staleTime: 60_000, // 1 min — adjust per resource freshness needs
  });
};

export const useCreate[Resource] = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create[Resource],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['[resource]'] }),
  });
};
```

---

## Component patterns

### Page component
```typescript
// pages/[Resource]ListPage.tsx — matches ui_contracts.md route exactly
export default function [Resource]ListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = use[Resource]List(page);

  if (isLoading) return <[Resource]ListSkeleton />;
  if (error) return <ErrorBanner message={error.message} onRetry={() => refetch()} />;
  if (!data?.data.length) return <EmptyState resource="[resource]" />;

  return (
    <div>
      {data.data.map(item => <[Resource]Card key={item.id} item={item} />)}
      <Pagination total={data.pagination.total} page={page} onChange={setPage} />
    </div>
  );
}
```

### Form component
```typescript
// All forms use react-hook-form + zod validation schema
const schema = z.object({ [field]: z.string().min(1) });

export function [Resource]Form({ mode, resourceId }: [Resource]FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const mutation = useCreate[Resource]();

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('[field]')} />
      {errors.[field] && <span>{errors.[field].message}</span>}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
```

---

## Routing

**Library:** [e.g. React Router v6 / TanStack Router / Next.js App Router]

**Auth guard pattern:**
```typescript
// Wrap protected routes — redirects to /login if no valid token
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

## Loading, error, and empty states

> Every data-fetching component must handle all three. No exceptions.

| State | Pattern |
|-------|---------|
| Loading | Skeleton that matches the shape of loaded content |
| Error | Error banner with message + retry button |
| Empty | Contextual empty state with actionable CTA |

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL of the API server |
| `VITE_APP_ENV` | `development` / `staging` / `production` |
