import { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { Button } from "../ui/button";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock  } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import "./styles.css";

const locales = {
  "vi-VN": vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: View) => void;
  view: View;
}

const CustomToolbar = ({ label, onNavigate, onView, view }: CustomToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-4 pb-4 border-b">
      <div className="flex items-center gap-2">
        <Button
          onClick={(e) => {
            e.preventDefault();
            onNavigate("PREV");
          }}
          type="button"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onNavigate("TODAY");
          }}
          variant="outline"
          type="button"
        >
          Hôm nay
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onNavigate("NEXT");
          }}
          type="button"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <h2 className="font-semibold text-xl">{label}</h2>

      <div className="flex gap-1">
        {(["month", "week", "day"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 ${
              view === v
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {v === "month"
              ? "Tháng"
              : v === "week"
              ? "Tuần"
              : v === "day"
              ? "Ngày"
              : "Danh sách"}
          </button>
        ))}
      </div>
    </div>
  );
};

// Custom Event Component
interface CustomEventProps {
  event: {
    title: string;
    start: Date;
    end: Date;
  };
}

const CustomEvent = ({ event }: CustomEventProps) => {
  return (
    <div className="px-1 py-0.5 font-medium text-xs truncate">
      {event.title}
    </div>
  );
};

interface CalendarEvent {
  id?: number | string;
  title: string;
  start: Date;
  end: Date;
}

interface BigCalendarComponentProps {
  events?: CalendarEvent[];
}

const BigCalendarComponent = ({ events = [] }: BigCalendarComponentProps) => {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="bg-background p-6 w-full h-screen">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 48px)" }}
          view={view}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          onView={(v: View) => setView(v)}
          onSelectEvent={handleSelectEvent}
          culture="vi-VN"
          formats={{
            monthHeaderFormat: (date: Date) => format(date, "MMMM yyyy", { locale: vi }),
            dayHeaderFormat: (date: Date) => format(date, "EEEE, dd/MM/yyyy", { locale: vi }),
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, "dd/MM", { locale: vi })} - ${format(end, "dd/MM/yyyy", { locale: vi })}`,
          }}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
          }}
          messages={{
            today: "Hôm nay",
            previous: "Trước",
            next: "Sau",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            agenda: "Danh sách",
            date: "Ngày",
            time: "Thời gian",
            event: "Sự kiện",
            noEventsInRange: "Không có sự kiện nào trong khoảng thời gian này.",
            allDay: "Cả ngày",
          }}
        />
      </div>

      {/* Event Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              Chi tiết sự kiện
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="mb-1 font-medium text-sm">Thời gian</p>
                  <p className="text-muted-foreground text-sm">
                    {format(selectedEvent.start, "EEEE, dd/MM/yyyy", { locale: vi })}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {format(selectedEvent.start, "HH:mm", { locale: vi })} - {format(selectedEvent.end, "HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BigCalendarComponent;