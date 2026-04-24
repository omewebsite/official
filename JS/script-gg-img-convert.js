/**
 * script-gg-img-convert.js
 * ฟังก์ชันสำหรับแปลง Google Drive share link → URL ที่แสดงรูปบน browser ได้โดยตรง
 * สามารถนำไปใช้ได้กับทุกส่วนของเว็บที่ต้องการแสดงรูปจาก Google Drive
 */

/**
 * สกัด File ID จาก Google Drive URL
 * รองรับรูปแบบ:
 *   - https://drive.google.com/file/d/{id}/view
 *   - https://drive.google.com/file/d/{id}/view?usp=sharing
 *   - https://drive.google.com/open?id={id}
 *
 * @param {string} driveUrl - Google Drive URL
 * @returns {string|null} - File ID หรือ null ถ้าสกัดไม่ได้
 */
function extractGDriveId(driveUrl) {
  if (!driveUrl) return null;

  // รูปแบบ /file/d/{id}/
  const matchFile = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) return matchFile[1];

  // รูปแบบ ?id={id} หรือ &id={id}
  const matchParam = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchParam) return matchParam[1];

  return null;
}

/**
 * แปลง Google Drive URL → lh3.googleusercontent.com URL ที่แสดงรูปได้โดยตรง
 *
 * @param {string} driveUrl - Google Drive share URL
 * @param {string} [width="1080"] - ความกว้างของรูป (ค่า default 1080px)
 * @returns {string|null} - URL รูปที่ใช้งานได้ หรือ null ถ้าแปลงไม่ได้
 */
function convertGDriveToImgUrl(driveUrl, width = "1080") {
  const id = extractGDriveId(driveUrl);
  if (!id) {
    console.warn("script-gg-img-convert: ไม่สามารถสกัด ID จาก URL นี้ได้ →", driveUrl);
    return null;
  }
  return `https://lh3.googleusercontent.com/u/0/d/${id}=w${width}`;
}

/**
 * ตั้งค่ารูป Banner เหนือส่วน "หลักสูตรที่รับผิดชอบ"
 * โดยแปลง Google Drive URL แล้วใส่ใน src ของ img#course-banner
 *
 * @param {string} driveUrl - Google Drive share URL ของรูป banner
 */
function setCourseBanner(driveUrl) {
  const imgEl = document.getElementById("course-banner");
  if (!imgEl) {
    console.warn("script-gg-img-convert: ไม่พบ element #course-banner");
    return;
  }

  const imgUrl = convertGDriveToImgUrl(driveUrl);
  if (!imgUrl) return;

  imgEl.src = imgUrl;
  imgEl.alt = "Course Banner";
}

/* ───────────────────────────────────────────────
   กำหนด Google Drive URL ของรูป Banner ที่นี่
   แก้เฉพาะค่านี้เมื่อต้องการเปลี่ยนรูป
─────────────────────────────────────────────── */
const COURSE_BANNER_URL = "https://drive.google.com/file/d/11olJFKI9Lwc4hNK5iPEFMwb1CAXcAPDP/view";

window.addEventListener("DOMContentLoaded", () => {
  setCourseBanner(COURSE_BANNER_URL);
});
