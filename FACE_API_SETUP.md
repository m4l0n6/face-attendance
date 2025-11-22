# Hướng dẫn tải Face-API Models

Để sử dụng face detection, bạn cần tải các model files vào thư mục `/public/models`.

## Tải models

1. Truy cập: https://github.com/justadudewhohacks/face-api.js-models
2. Tải các files sau về thư mục `public/models`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`
   - `face_expression_model-weights_manifest.json`
   - `face_expression_model-shard1`

## Hoặc clone repository

```bash
cd public
git clone https://github.com/justadudewhohacks/face-api.js-models.git
mv face-api.js-models models
```

## Cấu trúc thư mục

```
public/
  models/
    tiny_face_detector_model-weights_manifest.json
    tiny_face_detector_model-shard1
    face_landmark_68_model-weights_manifest.json
    face_landmark_68_model-shard1
    face_recognition_model-weights_manifest.json
    face_recognition_model-shard1
    face_recognition_model-shard2
    face_expression_model-weights_manifest.json
    face_expression_model-shard1
```

## Tính năng đã tích hợp

- ✅ Phát hiện khuôn mặt real-time
- ✅ Vẽ landmarks và face detection box
- ✅ Ghi nhận face descriptor để so sánh
- ✅ Hiển thị biểu cảm khuôn mặt
- ✅ Đếm số lượng khuôn mặt trong khung hình

## Sử dụng

1. Khởi động dev server: `npm run dev`
2. Truy cập trang face-record
3. Nhấn "Bắt đầu phát hiện" để kích hoạt face detection
4. Nhấn "Ghi nhận khuôn mặt" để lưu face descriptor
