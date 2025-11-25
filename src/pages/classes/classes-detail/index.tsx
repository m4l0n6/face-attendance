import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClassStore } from "@/stores/classes";

import type { Classes } from "@/services/classes/typing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


const ClassesDetailPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { classes, fetchClasses } = useClassStore();
  const [currentClass, setCurrentClass] = useState<Classes | null>(null);

  useEffect(() => {
    if (classes.length === 0) {
      fetchClasses();
    }
  }, [classes.length, fetchClasses]);

  useEffect(() => {
    const classData = classes.find((c) => c.id === classId);
    setCurrentClass(classData || null);
  }, [classId, classes]);


  if (!currentClass) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
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
          <CardTitle>Danh sách buổi học</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ClassesDetailPage;
