import { Spinner } from "@/components/ui/spinner"

export function Load() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Spinner className="mx-auto mb-2 w-24 h-24 text-primary"/>
        <p className="text-muted-foreground text-sm">Đang tải...</p>
      </div>
    </div>
  );
}