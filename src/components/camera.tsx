import React, { useEffect, useRef } from "react";

interface CameraViewProps {
  width?: number;
  height?: number;
  onVideoReady?: (video: HTMLVideoElement) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

const CameraView: React.FC<CameraViewProps> = ({
  width = 640,
  height = 480,
  onVideoReady,
  canvasRef,
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
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && onVideoReady) {
              onVideoReady(videoRef.current);
            }
          };
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
    <div className="relative flex justify-center items-center w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="shadow-lg border rounded-xl w-full max-w-full h-auto"
        style={{ maxWidth: width, aspectRatio: `${width}/${height}` }}
      />
      {canvasRef && (
        <canvas
          ref={canvasRef}
          className="top-0 left-0 absolute w-full h-full"
        />
      )}
    </div>
  );
};

export default CameraView;
