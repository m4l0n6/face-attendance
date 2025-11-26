import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"


import { HardDrive } from "lucide-react";

interface EmptyDataProps {
  title?: string;
}

const EmptyData = ({ title = "Không có dữ liệu" }: EmptyDataProps) => {
    return (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HardDrive size={24} />
              </EmptyMedia>
              <EmptyTitle>{title}</EmptyTitle>
            </EmptyHeader>
          </Empty>
    );
}

export default EmptyData

