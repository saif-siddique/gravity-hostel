// components/client-only.tsx
"use client";

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
