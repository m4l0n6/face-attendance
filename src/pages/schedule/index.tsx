import BigCalendar from "@/components/BigCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const sampleEvents = [
  {
    id: 1,
    title: "Họp team",
    start: new Date(2025, 10, 25, 10, 0),
    end: new Date(2025, 10, 25, 11, 0),
  },
  {
    id: 2,
    title: "Review code",
    start: new Date(2025, 10, 26, 14, 0),
    end: new Date(2025, 10, 26, 15, 30),
  },
  {
    id: 3,
    title: "Gặp khách hàng",
    start: new Date(2025, 10, 27, 9, 0),
    end: new Date(2025, 10, 27, 10, 30),
  },
  {
    id: 4,
    title: "Workshop",
    start: new Date(2025, 10, 28, 13, 0),
    end: new Date(2025, 10, 28, 17, 0),
  },
  {
    id: 5,
    title: "Sprint Planning",
    start: new Date(2025, 10, 29, 10, 0),
    end: new Date(2025, 10, 29, 12, 0),
  },
];

const SchedulePage = () => {
  // Sắp xếp events theo thời gian
  const upcomingEvents = [...sampleEvents]
    .filter((event) => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 p-6 h-screen overflow-hidden">
      {/* Calendar Section */}
      <div className="lg:col-span-2 overflow-hidden">
        <div>Lịch học</div>
        <BigCalendar events={sampleEvents} />
      </div>

      {/* Upcoming Events Section */}
      <div className="flex flex-col h-full overflow-hidden">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lịch sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 overflow-y-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-accent/50 hover:bg-accent p-4 border rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {format(event.start, "dd/MM", { locale: vi })}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{format(event.start, "EEEE", { locale: vi })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(event.start, "HH:mm", { locale: vi })} -{" "}
                      {format(event.end, "HH:mm", { locale: vi })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center py-12 text-center">
                <Calendar className="opacity-50 mb-3 w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">Không có sự kiện sắp tới</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePage;