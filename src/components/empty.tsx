import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"


import { HardDrive } from "lucide-react";

const EmptyData = () => {
    return (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HardDrive size={24} />
              </EmptyMedia>
              <EmptyTitle>Không có dữ liệu</EmptyTitle>
            </EmptyHeader>
          </Empty>
    );
}

export default EmptyData

