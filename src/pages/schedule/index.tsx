import BigCalendar from "@/components/BigCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Calendar1Icon, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useScheduleStore } from "@/stores/schedules";
import { Load } from "@/components/load";


const SchedulePage = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof calendarEvents[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const schedules = useScheduleStore((state) => state.schedules);
  const isLoading = useScheduleStore((state) => state.isLoading);
  const fetchSchedules = useScheduleStore((state) => state.fetchSchedules);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchSchedules(token);
    }
  }, [token, fetchSchedules]);

  const calendarEvents =
    schedules?.map((item: { id: string; sessionName: string; startDateTime: string; endDateTime: string }) => ({
      id: item.id,
      title: item.sessionName,
      start: new Date(item.startDateTime),
      end: new Date(item.endDateTime),
    })) || [];

  // Sắp xếp events theo thời gian
  const upcomingEvents = [...calendarEvents]
    .filter((event) => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const handleEventClick = (event: typeof calendarEvents[0]) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
      </div>
    );
  }

  return (
    <>
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 p-6 h-screen overflow-hidden">
        {/* Calendar Section */}
        <div className="lg:col-span-2 overflow-hidden">
          <BigCalendar events={calendarEvents} />
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
                    onClick={() => handleEventClick(event)}
                    className="hover:bg-accent p-4 border rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span>
                        {format(event.start, "dd/MM", { locale: vi })}
                      </span>
                      <Badge variant="default" className="ml-2 shrink-0">
                        <span>
                          {format(event.start, "HH:mm", { locale: vi })} -{" "}
                          {format(event.end, "HH:mm", { locale: vi })}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      <h1>{event.title}</h1>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm"></div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col justify-center items-center py-12 text-center">
                  <Calendar className="opacity-50 mb-3 w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Không có sự kiện sắp tới
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar1Icon className="w-5 h-5" />
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>Chi tiết sự kiện</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="mb-1 font-medium text-sm">Thời gian</p>
                  <p className="text-muted-foreground text-sm">
                    {format(selectedEvent.start, "EEEE, dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {format(selectedEvent.start, "HH:mm", { locale: vi })} -{" "}
                    {format(selectedEvent.end, "HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchedulePage;