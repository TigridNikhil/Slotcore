import { Puff } from "react-loader-spinner";

const Loader = () => {
return (
    <div className="absolute inset-0 flex justify-center z-50 ">
        <div className="bg-[#ffffff4b] w-full h-full flex justify-center pt-[50vh]">
            <Puff
                visible={true}
                height={80}
                width={80}
                color="#f54312"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    </div>
);
};

export default Loader;
