import React, { useEffect, useRef } from "react";

interface CameraViewProps {
  width?: number;
  height?: number;
}

const CameraView: React.FC<CameraViewProps> = ({
  width = 640,
  height = 480,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: "user",
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Lỗi mở camera:", error);
      }
    };

    startCamera();

    // Cleanup: tắt camera khi rời trang
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [width, height]);

  return (
    <div className="flex justify-center items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="shadow-lg border rounded-xl"
        style={{ width, height }}
      />
    </div>
  );
};

export default CameraView;
