import React from "react";
import {PacmanLoader} from "react-spinners";
export const Loader = () => {


    return (
        <div className="flex justify-center items-center h-44 w-full col-span-full absolute top-[50%] left-[50%]" style={{ transform: "translate(-50%, -50%)" }}>
            {/*<CircleLoader color={"#2b6cb0"} size={25} />*/}
            {/*<BarLoader color={"#2b6cb0"} size={25} />*/}
            {/*<DotLoader color={"#2b6cb0"} size={25} />*/}
            <PacmanLoader color={"#2b6cb0"} size={25} />
            {/*<BeatLoader color={"#2b6cb0"} size={25} />*/}
            {/*<BounceLoader color={"#2b6cb0"} size={25} />*/}
            {/*<ClipLoader color={"#2b6cb0"} size={25} />*/}
            {/*<CircleLoader color={"#2b6cb0"} size={25} />*/}
            {/*<ClimbingBoxLoader color={"#2b6cb0"} size={25} />*/}

        </div>
    );
}
