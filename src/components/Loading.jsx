import ShinyText from "./blocks/TextAnimations/ShinyText/ShinyText";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
    <ShinyText text="Loading..." speed={3}  />
    </div>
  );
};

export default Loading;
