import * as faceapi from "face-api.js";

let modelsLoaded = false;

export const loadFaceApiModels = async () => {
  if (modelsLoaded) return;

  const MODEL_URL = "/models";

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    console.log("Face-api models loaded successfully");
  } catch (error) {
    console.error("Error loading face-api models:", error);
    throw error;
  }
};

export const detectFace = async (videoElement: HTMLVideoElement) => {
  if (!modelsLoaded) {
    await loadFaceApiModels();
  }

  const detections = await faceapi
    .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();

  return detections;
};

export const drawDetections = (
  canvas: HTMLCanvasElement,
  detections: faceapi.WithFaceDescriptor<
    faceapi.WithFaceLandmarks<
      {
        detection: faceapi.FaceDetection;
      },
      faceapi.FaceLandmarks68
    >
  >[]
) => {
  const displaySize = {
    width: canvas.width,
    height: canvas.height,
  };

  faceapi.matchDimensions(canvas, displaySize);
  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  faceapi.draw.drawDetections(canvas, resizedDetections);
//   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
};

export const captureFaceDescriptor = async (videoElement: HTMLVideoElement) => {
  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection?.descriptor;
};

export const compareFaces = (
  descriptor1: Float32Array,
  descriptor2: Float32Array,
  threshold: number = 0.6
): boolean => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance < threshold;
};
