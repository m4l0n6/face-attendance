import { DataTable } from "@/components/common/DataTable";
import {
  createIndexColumn,
  createSortableColumn,
  createDateColumn,
  createActionsColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useClassStore } from "@/stores/classes";
import { Classes } from "@/services/classes/typing";
import { useEffect } from "react";
import { Load } from "@/components/load";
import { useNavigate } from "react-router-dom";

const ClassesPage = () => {
  const classData = useClassStore((state) => state.classes);
  const fetchClasses = useClassStore((state) => state.fetchClasses);
  const isLoading = useClassStore((state) => state.isLoading);
  const error = useClassStore((state) => state.error);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const columns: ColumnDef<Classes>[] = [
    createIndexColumn(),
    createSortableColumn("code", "Mã lớp"),
    createSortableColumn("name", "Tên lớp"),
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    createDateColumn("createdAt", "Ngày tạo"),
    createActionsColumn({
      onView: (classItem) => {
        navigate(`/classes/${classItem.id}`);
      }
    })
  ];

  if (isLoading && classData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 h-64">
        <div className="text-destructive">Lỗi: {error}</div>
        <button 
          onClick={() => fetchClasses()} 
          className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 font-bold text-2xl">Lớp học</h1>
      <DataTable
        columns={columns}
        data={classData}
        searchKey="name"
        searchPlaceholder="Tìm kiếm lớp học..."
      />
    </div>
  );
};

export default ClassesPage;
