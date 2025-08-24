import "../css/Skeleton.css";
import SkeletonBox from "./SkeletonBox";

export default function SkeletonMain() {
  return (
    <>
      <div className='loading-box'>
        <span className='loading'></span>
      </div>
      <SkeletonBox />
      <div className='skeleton-line'></div>
      <SkeletonBox />;
    </>
  );
}
