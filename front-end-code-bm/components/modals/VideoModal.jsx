// "use client";

// import React, { useEffect, useState } from "react";

// export default function VideoModalPopup() {
//   const [videoUrl, setVideoUrl] = useState("");

//   useEffect(() => {
//     const handleClick = (event) => {
//       const link = event.target.closest("a[data-video-url]");
//       if (link) {
//         setVideoUrl(link?.getAttribute("data-video-url"));
//       }
//     };

//     document.addEventListener("click", handleClick);

//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, []);

//   return (
//     <div
//       className="modal modalCentered fade modalDemo-1 tf-product-modal-oo modal-part-content videoModalPopupWrapper"
//       id="videoModalPopup"

//     >
//       <div className="modal-dialog modal-xl modal-dialog-centered">
//         <div className="modal-content">
//           <div className="header">
//             <span
//               className="icon-close icon-close-popup"
//               data-bs-dismiss="modal"
//             />

//           </div>
//           <div className="embed-responsive embed-responsive-16by9">
//             <video
//               src={videoUrl}
//               autoPlay
//               muted
//               playsInline
//               loop
//               controls
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";

export default function VideoModalPopup() {
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        const handleClick = (event) => {
            const link = event.target.closest("a[data-video-url]");
            if (link) {
                setVideoUrl(link?.getAttribute("data-video-url") || "");
            }
        };

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const isYouTubeUrl =
        videoUrl?.startsWith("http") &&
        /(youtube\.com|youtu\.be)/.test(videoUrl);

    const youtubeEmbedUrl = isYouTubeUrl
        ? `https://www.youtube.com/embed/${
              videoUrl.split("v=")[1]?.split("&")[0] ||
              videoUrl.split("/").pop()
          }?autoplay=1`
        : null;

    return (
        <div
            className="modal modalCentered fade modalDemo-1 tf-product-modal-oo modal-part-content videoModalPopupWrapper"
            id="videoModalPopup"
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    <div className="header">
                        <span
                            className="icon-close icon-close-popup"
                            data-bs-dismiss="modal"
                        />
                    </div>

                    <div className="embed-responsive embed-responsive-16by9">
                        {isYouTubeUrl ? (
                            <iframe
                                width="100%"
                                height="500"
                                src={youtubeEmbedUrl}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                        ) : videoUrl ? (
                            <video
                                src={videoUrl}
                                autoPlay
                                muted
                                playsInline
                                loop
                                controls
                                width="100%"
                            />
                        ) : (
                            <p>No video available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
