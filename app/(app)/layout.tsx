// app/(app)/layout.tsx
import Sidebar from "@/components/Sidebar";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-5">
      <div>
        <Sidebar />
      </div>
      <div className="col-span-4">
        <div>{children}</div>
      </div>
    </div>
  );
}
