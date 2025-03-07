import PageTransition from "@/lib/PageTransition";

export default function AdminLayout({ children }) {
  return (
    <div>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
