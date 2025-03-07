import React from "react";
import "./styles.css"; // Tạo file CSS này để chứa phần keyframes

const LoadingComponent = () => {
  return (
    <div className="flex min-h-[500px] w-full flex-col items-center justify-center py-4 text-center">
      <div height="400" width="400" className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 210 48"
          width="210"
          height="48"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <clipPath id="__lottie_element_2">
              <rect width="210" height="48" x="0" y="0"></rect>
            </clipPath>
            <mask id="__lottie_element_12">
              <path
                fill="#ffffff"
                d="M0,0 h210 v48 h-210 v-48 M316.803,10 C316.803,10 164.058,10 164.058,10 C164.058,10 164.058,36.816 164.058,36.816 C164.058,36.816 316.803,36.816 316.803,36.816 C316.803,36.816 316.803,10 316.803,10"
                fillOpacity="1"
              ></path>
            </mask>
          </defs>
          {/* Dots */}
          <g clipPath="url(#__lottie_element_2)">
            <g transform="matrix(1,0,0,1,19.75,19.75)">
              <g transform="matrix(1,0,0,1,4.25,4.25)">
                <circle fill="rgb(136,53,200)" r="4" />
              </g>
              <g transform="matrix(1,0,0,1,44.25,4.25)">
                <circle fill="rgb(136,53,200)" r="4" />
              </g>
              <g transform="matrix(1,0,0,1,84.25,4.25)">
                <circle fill="rgb(136,53,200)" r="4" />
              </g>
              <g transform="matrix(1,0,0,1,124.25,4.25)">
                <circle fill="rgb(136,53,200)" r="4" />
              </g>
              <g transform="matrix(1,0,0,1,164.25,4.25)">
                <circle fill="rgb(136,53,200)" r="4" />
              </g>
            </g>
          </g>
          {/* Airplane */}
          <g className="plane">
            <g transform="matrix(1,0,0,1,19.75,19.75)">
              <g transform="matrix(1,0,0,1,4.25,4.25)">
                <path
                  fill="rgb(218,218,218)"
                  d="M-5.25,19 C-4.53,19 -3.87,18.62 -3.47,18.02 C-3.47,18.02 5.91,3 5.91,3 C5.91,3 16.91,3 16.91,3 C18.57,3 19.91,1.66 19.91,0 C19.91,-1.66 18.57,-3 16.91,-3 C16.91,-3 5.91,-3 5.91,-3 C5.91,-3 -3.47,-18.02 -3.47,-18.02 C-3.85,-18.62 -4.53,-19 -5.25,-19 C-6.65,-19 -7.67,-17.64 -7.25,-16.28 C-7.25,-16.28 -3.09,-3 -3.09,-3 C-3.09,-3 -14.09,-3 -14.09,-3 C-14.09,-3 -16.79,-6.6 -16.79,-6.6 C-16.97,-6.86 -17.27,-7 -17.59,-7 C-17.59,-7 -18.77,-7 -18.77,-7 C-19.43,-7 -19.91,-6.36 -19.73,-5.72 C-19.73,-5.72 -18.09,0 -18.09,0 C-18.09,0 -19.73,5.72 -19.73,5.72 C-19.91,6.36 -19.43,7 -18.77,7 C-18.77,7 -17.59,7 -17.59,7 C-17.27,7 -16.97,6.86 -16.79,6.6 C-16.79,6.6 -14.09,3 -14.09,3 C-14.09,3 -3.09,3 -3.09,3 C-3.09,3 -7.25,16.28 -7.25,16.28 C-7.67,17.64 -6.65,19 -5.25,19z"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <p>Đang tìm các chuyến bay của bạn...</p>
    </div>
  );
};

export default LoadingComponent;
