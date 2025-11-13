import CameraView from "@/components/camera";
const FaceRecordPage: React.FC = () => {
  return <div>
    <h1 className="mb-4 font-bold text-2xl text-center">Ghi hình khuôn mặt</h1>
    <CameraView width={640} height={480} />
  </div>;
};

export default FaceRecordPage;
