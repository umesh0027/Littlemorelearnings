// edtech-frontend/src/components/Courses/CourseDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import "./CourseDetail.css";
import axios from "axios";

// Helper function to get YouTube embed URL from various YouTube URLs
const getYouTubeEmbedUrl = (videoUrl) => {
  if (!videoUrl) return "";

  // Regex to extract video ID from various YouTube URL formats
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
  const match = videoUrl.match(regExp);

  if (match && match[1]) {
    // Construct the embed URL with parameters for autoplay, controls, etc.
    // return `http://www.youtube.com/embed/${match[1]}?autoplay=1&controls=1&showinfo=0&rel=0`;
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&controls=1&showinfo=0&rel=0`;

    // autoplay=1: Starts video automatically
    // controls=1: Shows player controls
    // showinfo=0: Hides video title and uploader info
    // rel=0: Prevents showing related videos at the end
  }
  // If it's not a recognizable YouTube URL, return an empty string
  return "";
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [courseTitle, setCourseTitle] = useState("Loading Course...");
  const [videos, setVideos] = useState([]);

  // State for popup message
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to show popup message
  const showPopup = (message) => {
    setPopupMessage(message);
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
      setPopupMessage("");
    }, 3000); // Popup disappears after 3 seconds
  };

  useEffect(() => {
    // Fetch course details
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/courses/${courseId}`)
      .then((res) => {
        setCourseTitle(res.data.title);
      })
      .catch((err) => {
        console.error("Error fetching course details:", err);
        setCourseTitle("Course Not Found");
        showPopup("Failed to load course details.");
      });

    // Fetch videos for the specific course
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/courses/${courseId}/videos`)
      .then((res) => {
        setVideos(res.data);
        if (res.data.length > 0) {
          setCurrentVideoIndex(0);
        } else {
          showPopup("No videos found for this course.");
        }
      })
      .catch((err) => {
        console.error("Error fetching course videos:", err);
        showPopup("Failed to load course videos.");
      });
  }, [courseId]);

  const currentVideo = videos[currentVideoIndex];
  const youtubeEmbedUrl = currentVideo
    ? getYouTubeEmbedUrl(currentVideo.url)
    : "";

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      showPopup("Next video playing.");
    } else {
      showPopup("You've reached the end of the course videos.");
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      showPopup("Previous video playing.");
    } else {
      showPopup("This is the first video.");
    }
  };

  // const handleDownloadPDF = () => {
  //   if (currentVideo && currentVideo.pdf_url) {
  //     // Check if pdf_url is already an absolute URL (starts with http/https)
  //     // If not, prepend your backend base URL
  //     const pdfToOpen = currentVideo.pdf_url.startsWith("http")
  //       ? currentVideo.pdf_url
  //       : `http://localhost:5000${
  //           currentVideo.pdf_url.startsWith("/") ? "" : "/"
  //         }${currentVideo.pdf_url}`;
  //     window.open(pdfToOpen, "_blank");
  //     showPopup("PDF download initiated.");
  //   } else {
  //     showPopup("No PDF notes available for this video.");
  //   }
  // };

  const handleDownloadPDF = () => {
  if (currentVideo && currentVideo.pdf_url) {
    // Check if pdf_url is already an absolute URL
    const pdfToOpen = currentVideo.pdf_url.startsWith("http")
      ? currentVideo.pdf_url
      : `${process.env.REACT_APP_BASE_URL.replace('/api', '')}${
          currentVideo.pdf_url.startsWith("/") ? "" : "/"
        }${currentVideo.pdf_url}`;

    window.open(pdfToOpen, "_blank");
    showPopup("PDF download initiated.");
  } else {
    showPopup("No PDF notes available for this video.");
  }
};


  const handleMarkAsComplete = () => {
    showPopup("Video marked as complete!");
    // TODO: Add logic to update completion status in backend (e.g., store user progress)
  };

  return (
    <div className="course-detail-container">
      <h1>{courseTitle}</h1>

      <div className="course-detail-content">
        <div className="video-section">
          {currentVideo && youtubeEmbedUrl ? ( // Ensure a video is selected and its embed URL is valid
            <>
              {/* Using <iframe> for YouTube video embedding */}
              <iframe
                src={youtubeEmbedUrl}
                title={currentVideo.title} // For accessibility
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: "100%",
                  aspectRatio: "16/9", // Maintain 16:9 aspect ratio
                  borderRadius: "8px",
                }}
              ></iframe>
              <div className="video-description">
                <h2>{currentVideo.title}</h2>
                <p>{currentVideo.description}</p>
              </div>
              <div className="video-controls">
                <div className="nav-buttons">
                  <button
                    onClick={handlePrevVideo}
                    disabled={currentVideoIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                  >
                    Next
                  </button>
                </div>
                {/* <button
                  onClick={handleDownloadPDF}
                  className="download-pdf-btn"
                  disabled={!currentVideo || !currentVideo.pdf_url}
                >
                  <FaDownload /> Download PDF
                </button> */}

                {currentVideo && currentVideo.pdf_url && (
  <button onClick={handleDownloadPDF} className="download-pdf-btn">
    <FaDownload /> Download PDF
  </button>
)}

                <button
                  onClick={handleMarkAsComplete}
                  className="mark-complete-btn"
                >
                  Mark as Complete
                </button>
              </div>
            </>
          ) : (
            <p>
              {videos.length === 0 && courseTitle !== "Loading Course..."
                ? "No videos available for this course."
                : "Loading videos or video URL is invalid..."}
            </p>
          )}
        </div>

        <div className="video-list-section">
          <h2>Course Content</h2>
          {videos.length > 0 ? (
            <ul className="video-list-ul">
              {videos.map((video, index) => (
                <li
                  key={video._id}
                  className={`video-item ${
                    index === currentVideoIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <span className="video-number">{index + 1}.</span>{" "}
                  {video.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No video content to display.</p>
          )}
        </div>
      </div>

      {isPopupVisible && <div className="popup-message">{popupMessage}</div>}
    </div>
  );
}
