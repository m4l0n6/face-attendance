import { DataTable } from "@/components/common/DataTable";
import {
  createSortableColumn,
  createDateColumn,
  createActionsColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useClassStore } from "@/stores/classes";
import { Classes } from "@/services/classes/typing";

const ClassesPage = () => {
  const classData = useClassStore((state) => state.classes);

  const columns: ColumnDef<Classes>[] = [
    createSortableColumn("code", "Mã lớp"),
    createSortableColumn("name", "Tên lớp"),
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    createDateColumn("createdAt", "Ngày tạo"),
    createActionsColumn({
      onView: (classItem) => {
        console.log("View class:", classItem);
      }
    })
  ];

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
