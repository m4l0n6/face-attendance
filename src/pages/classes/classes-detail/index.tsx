import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClassStore } from "@/stores/classes";
import { useAuthStore } from "@/stores/auth";
import type { Classes, SessionAttendance } from "@/services/classes/typing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/DataTable";
import { createSimpleColumn, createIndexColumn } from "@/components/common/DataTableHelpers";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Load } from "@/components/load";
import type { ColumnDef } from "@tanstack/react-table";


const ClassesDetailPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { classes, fetchClasses, statistic, getStatisticStudentsInClass } = useClassStore();
  const [currentClass, setCurrentClass] = useState<Classes | null>(null);

  useEffect(() => {
    if (classes.length === 0) {
      fetchClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.studentInfo[0]?.studentId && classId) {
      getStatisticStudentsInClass(user.studentInfo[0].studentId, classId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const classData = classes.find((c) => c.id === classId);
    setCurrentClass(classData || null);
  }, [classId, classes]);

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    SCHEDULED: { label: "Đã lên lịch", variant: "secondary" },
    COMPLETED: { label: "Hoàn thành", variant: "default" },
    CANCELLED: { label: "Nghỉ", variant: "destructive" },
  };

  const columns: ColumnDef<SessionAttendance>[] = [
    createIndexColumn<SessionAttendance>(),
    createSimpleColumn<SessionAttendance>("sessionName", "Tên buổi học", {
      size: 150,
    }),
    createSimpleColumn<SessionAttendance>("sessionDate", "Ngày học", {
      size: 200,
      cell: (value) => format(new Date(value as string), "EEEE, dd/MM/yyyy", { locale: vi }),
    }),
    createSimpleColumn<SessionAttendance>("status", "Trạng thái", {
      size: 120,
      cell: (value) => {
        const status = value as string;
        const statusInfo = statusMap[status] || statusMap.SCHEDULED;
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
      },
    }),
    {
      accessorKey: "attended",
      header: "Điểm danh",
      size: 120,
      cell: ({ getValue }) => {
        const attended = getValue() as boolean;
        return (
          <div className="flex items-center gap-2">
            {attended ? (
              <>
                <Badge color='success'>Có mặt</Badge>
              </>
            ) : (
              <>
                <Badge variant='destructive'>Chưa điểm danh</Badge>
              </>
            )}
          </div>
        );
      },
    },
    createSimpleColumn<SessionAttendance>("attendanceTime", "Thời gian điểm danh", {
      size: 180,
      cell: (value) => {
        if (!value) return <span className="text-muted-foreground text-center">-</span>;
        return format(new Date(value as string), "HH:mm:ss dd/MM/yyyy", { locale: vi });
      },
    }),
  ];

  if (!currentClass) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/classes")}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-bold text-2xl">{currentClass.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lớp học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Mã lớp</p>
              <p className="font-semibold">{currentClass.code}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Số sinh viên</p>
              <p className="font-semibold">{currentClass._count.students}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Mô tả</p>
              <p className="font-semibold">
                {currentClass.description || "Không có mô tả"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Số phiên điểm danh
              </p>
              <p className="font-semibold">{currentClass._count.sessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê điểm danh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Tổng số buổi học</p>
              <p className="font-semibold text-2xl">{statistic?.statistics.totalSessions || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Đã tham gia</p>
              <p className="font-semibold text-green-600 text-2xl">{statistic?.statistics.attendedSessions || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Vắng mặt</p>
              <p className="font-semibold text-red-600 text-2xl">{statistic?.statistics.absentSessions || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tỷ lệ tham gia</p>
              <p className="font-semibold text-blue-600 text-2xl">{statistic?.statistics.attendanceRate || "0%"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách buổi học ({statistic?.sessions.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {statistic?.sessions && statistic.sessions.length > 0 ? (
            <DataTable
              columns={columns}
              data={statistic.sessions}
              searchKey="sessionName"
              searchPlaceholder="Tìm kiếm buổi học..."
              showCreateButton={false}
              showRefreshButton={false}
              pageSize={10}
            />
          ) : (
            <div className="py-12 text-muted-foreground text-center">
              Chưa có buổi học nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesDetailPage;
