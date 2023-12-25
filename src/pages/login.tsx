import React, { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import firebaseApp from "@/lib/firebase";
import { useRouter } from "next/router";
import { useAuth } from "@/auth/authContext";

function Page() {
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (user) {
        await router.push("/console");
      } else {
        setLoading(false);
      }
    };
    checkAuthentication().then(() => {});
  }, [user, router]);
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: "thechi.app",
    });

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        className="h-screen w-full flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          // @ts-ignore
          class="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        {/*@ts-ignore*/}
        <span class="sr-only">Loading...</span>
      </div>
    );
  }
  // return (
  //   <div className="h-screen w-full">
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="px-6 sm:px-0 max-w-sm">
  //         <button
  //           onClick={signInWithGoogle}
  //           type="button"
  //           className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
  //         >
  //           <svg
  //             className="mr-2 -ml-1 w-4 h-4"
  //             aria-hidden="true"
  //             focusable="false"
  //             data-prefix="fab"
  //             data-icon="google"
  //             role="img"
  //             xmlns="http://www.w3.org/2000/svg"
  //             viewBox="0 0 488 512"
  //           >
  //             <path
  //               fill="currentColor"
  //               d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
  //             ></path>
  //           </svg>
  //           Sign up with Google
  //           <div></div>
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="relative h-screen w-full flex bg-gradient-to-b from-sky-600 via-blue-900 to-blue-950 overflow-y-hidden">
      <div className="w-[638px] h-[583px] absolute bottom-[-400px] left-[-300px] hidden lg:block">
        <div className="w-[557px] h-[557px] left-[81px] top-[26px] absolute rounded-full border border-sky-600" />
        <div className="w-[557px] h-[557px] left-0 top-0 absolute rounded-full border border-sky-600" />
      </div>
      <div className="w-[60%] h-full  flex-col justify-center pl-[157px] hidden lg:flex">
        <div className="text-white text-[40px] font-bold ">Nfig Chat</div>
        <div className="text-base font-medium  text-white max-w-[600px]">
          Effortlessly automate testing cycles with Nfig - requires no coding or
          action recording.&nbsp;Achieve faster,&nbsp;more accurate results and streamline
          your testing process.
        </div>
        <div className="mt-6">
          <a
            href="https://thechi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="w-[135px] py-4 bg-[#155EEF] rounded-[45px] shadow text-white text-sm font-semibold leading-none">
              Know more
            </button>
          </a>
        </div>
      </div>
      <div className="w-full lg:w-[40%] relative bg-white flex items-center justify-center">
        <div>
          <div className="text-blue-950 text-2xl font-bold leading-normal">
            Login
          </div>
          <div className="text-base font-medium leading-7">
            Welcome Back
          </div>
          <button
            onClick={signInWithGoogle}
            type="button"
            className="mt-8 text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign up with Google
            <div></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
