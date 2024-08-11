import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <section className="p-6 sm:py-10  border-t-2 bg-white/60   absolute bottom-0  z-50 w-full">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 ">
        <div className="text-center py-4 sm:flex sm:items-center w-full sm:justify-between sm:text-left">
          <div className="sm:flex  sm:items-center items-center w-full sm:w-fit justify-center sm:justify-start">
            <h2 className="text-3xl  justify-center  sm:text-3xl flex items-center font-urbanist gap-1 font-semibold">
              <img className="w-7 sm:w-9" src="/logo.png" />
              Snapcv
            </h2>
          </div>

          <div className="items-center  w-full mt-5 sm:mt-0 sm:flex sm:justify-end sm:space-x-8">
            <p className="text-xl   font-urbanist text-gray-700 font-semibold">
              For feature requests or to get in touch, please contact me
            </p>
            <div className="w-full h-px  mt-8 mb-5 xl:w-0.5 xl:m-0 xl:h-6 bg-gray-800/50"></div>
            <div className="flex items-center justify-center space-x-4">
              <p className="text-xl font-urbanist text-gray-700 font-normal">
                Jamal
              </p>{" "}
              <Link
                href="mailto:jamalvga2002@gmail.com "
                className="text-2xl font-urbanist text-gray-700 font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/in/jamal-p-5156a1170"
                className="text-2xl font-urbanist text-gray-700 font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="50"
                  fill="#374151"
                  height="50"
                  className="text-[#374151] size-6"
                  viewBox="0 0 50 50"
                >
                  <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                </svg>
              </Link>
              <Link
                href="https://github.com/jamaljm"
                className="text-2xl font-urbanist text-gray-700 font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  fill="#374151"
                  height="30"
                  viewBox="0 0 30 30"
                  className="text-[#374151] size-7"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              </Link>
              <Link
                href="https://x.com/jamalVengara"
                className="text-2xl font-urbanist text-gray-700 font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="50"
                  height="50"
                  fill="#374151"
                  viewBox="0 0 50 50"
                  className="text-[#374151] size-6"
                >
                  <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
